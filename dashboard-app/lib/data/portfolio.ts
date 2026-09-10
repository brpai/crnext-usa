import type {
  Allocation,
  CapitalByVehicleSlice,
  InvestorAlert,
  InvestorPortfolio,
  InvestorPosition,
  RealizedMonthPoint,
  RealizedTrackRecord,
  Vehicle,
} from "../types";
import { INVESTOR_PROFIT_SHARE, isSold } from "../types";
import { vehicleLabel } from "../format";
import { MOCK_ALLOCATIONS } from "./mock/allocations";
import { MOCK_MOVEMENTS } from "./mock/movements";
import { MOCK_VEHICLES } from "./mock/vehicles";
import { MOCK_CONTRACTS } from "./mock/contracts";
import { MOCK_REQUESTS } from "./mock/requests";
import { getInvestor } from "./investors";

/**
 * Agregações da posição do investidor.
 *
 * Invariante desta camada: NENHUMA função aqui devolve resultado, lucro ou
 * valor a receber para veículo cujo `status !== 'vendido'`. Onde o resultado
 * ainda não existe, o campo é `null` — nunca zero, nunca estimativa.
 *
 * TODO(supabase): estas agregações viram views/RPC no Postgres
 * (ex.: `investor_positions`, `investor_realized_history`) com RLS por
 * investor_id, ou permanecem aqui consumindo selects simples.
 */

const ALERT_AGING_DAYS = 60;
const CONTRACT_ENDING_DAYS = 60;
const TODAY = new Date("2026-09-09T00:00:00Z"); // TODO(supabase): trocar por now()

/** Share do investidor no lucro líquido: 30% pro-rata da participação dele. */
function realizedShareCents(vehicle: Vehicle, allocation: Allocation): number | null {
  if (!isSold(vehicle)) return null;
  if (vehicle.netProfitCents <= 0) return 0;
  return Math.round(
    (vehicle.netProfitCents * INVESTOR_PROFIT_SHARE * allocation.sharePercent) / 100
  );
}

export async function getInvestorPositions(
  investorId: string
): Promise<InvestorPosition[]> {
  const mine = MOCK_ALLOCATIONS.filter((a) => a.investorId === investorId);

  return mine
    .map((allocation) => {
      const vehicle = MOCK_VEHICLES.find((v) => v.id === allocation.vehicleId);
      if (!vehicle) return null;

      const onSameVehicle = MOCK_ALLOCATIONS.filter(
        (a) => a.vehicleId === vehicle.id
      );
      const others = onSameVehicle
        .filter((a) => a.investorId !== investorId)
        .map((a) => a.sharePercent);

      const payment = MOCK_MOVEMENTS.find(
        (m) =>
          m.investorId === investorId &&
          m.vehicleId === vehicle.id &&
          m.type === "distribuicao_lucro"
      );

      const position: InvestorPosition = {
        vehicle,
        allocation,
        coInvestorCount: onSameVehicle.length,
        otherSharePercents: others,
        realizedShareCents: realizedShareCents(vehicle, allocation),
        paidAt: payment?.date ?? null,
      };
      return position;
    })
    .filter((p): p is InvestorPosition => p !== null)
    .sort((a, b) =>
      a.vehicle.purchaseDate < b.vehicle.purchaseDate ? 1 : -1
    );
}

/** Histórico realizado, mês a mês. Somente meses passados; sem extrapolação. */
function buildRealizedHistory(investorId: string): RealizedMonthPoint[] {
  const byMonth = new Map<string, RealizedMonthPoint>();

  for (const m of MOCK_MOVEMENTS) {
    if (m.investorId !== investorId) continue;
    if (m.type !== "alocacao" && m.type !== "distribuicao_lucro") continue;

    const month = m.date.slice(0, 7);
    const point =
      byMonth.get(month) ??
      { month, allocatedCents: 0, distributedCents: 0 };

    if (m.type === "alocacao") point.allocatedCents += m.amountCents;
    else point.distributedCents += m.amountCents;

    byMonth.set(month, point);
  }

  return [...byMonth.values()].sort((a, b) => (a.month < b.month ? -1 : 1));
}

function buildCapitalByVehicle(
  positions: InvestorPosition[]
): CapitalByVehicleSlice[] {
  const active = positions.filter((p) => !isSold(p.vehicle));
  const total = active.reduce((n, p) => n + p.allocation.amountCents, 0);

  return active
    .map((p) => ({
      vehicleId: p.vehicle.id,
      label: vehicleLabel(p.vehicle),
      amountCents: p.allocation.amountCents,
      percent: total === 0 ? 0 : (p.allocation.amountCents / total) * 100,
    }))
    .sort((a, b) => b.amountCents - a.amountCents);
}

/**
 * Avisos operacionais. Redigidos como informação de acompanhamento — nunca
 * como expectativa de pagamento ou de data de venda.
 */
function buildAlerts(
  investorId: string,
  positions: InvestorPosition[]
): InvestorAlert[] {
  const alerts: InvestorAlert[] = [];

  for (const p of positions) {
    if (isSold(p.vehicle)) continue;
    if (p.vehicle.daysInStock > ALERT_AGING_DAYS) {
      alerts.push({
        kind: "aging",
        severity: "atencao",
        title: `${vehicleLabel(p.vehicle)} está há ${p.vehicle.daysInStock} dias em estoque`,
        detail:
          "Informação de acompanhamento do tempo de estoque. Não indica data de venda.",
        href: `/veiculos/${p.vehicle.id}`,
      });
    }
  }

  const pending = MOCK_REQUESTS.filter(
    (r) =>
      r.investorId === investorId &&
      (r.status === "pendente" || r.status === "em_analise")
  );
  for (const r of pending) {
    alerts.push({
      kind: "solicitacao",
      severity: "info",
      title: "Você tem uma solicitação de aporte em aberto",
      detail: `Status: ${r.status === "pendente" ? "pendente" : "em análise"}.`,
      href: "/aporte",
    });
  }

  for (const c of MOCK_CONTRACTS.filter(
    (c) => c.investorId === investorId && c.status === "vigente"
  )) {
    const remaining = Math.round(
      (new Date(c.validUntil).getTime() - TODAY.getTime()) / 86400000
    );
    if (remaining <= CONTRACT_ENDING_DAYS) {
      alerts.push({
        kind: "contrato",
        severity: "info",
        title: "Contrato próximo do fim da vigência",
        detail:
          "Vigência é o período de validade do acordo. Não é prazo de pagamento nem de devolução de capital.",
        href: "/contratos",
      });
    }
  }

  return alerts;
}

export async function getInvestorPortfolio(
  investorId: string
): Promise<InvestorPortfolio | null> {
  const investor = await getInvestor(investorId);
  if (!investor) return null;

  const positions = await getInvestorPositions(investorId);

  return {
    investor,
    positions,
    inStockCount: positions.filter((p) => !isSold(p.vehicle)).length,
    soldCount: positions.filter((p) => isSold(p.vehicle)).length,
    realizedHistory: buildRealizedHistory(investorId),
    capitalByVehicle: buildCapitalByVehicle(positions),
    alerts: buildAlerts(investorId, positions),
  };
}

/**
 * Histórico realizado da operação — apenas fatos de veículos já vendidos, mais
 * a contagem do que segue em estoque (inclusive aging alto). Nenhuma projeção.
 */
export async function getRealizedTrackRecord(): Promise<RealizedTrackRecord> {
  const sold = MOCK_VEHICLES.filter(isSold);
  const inStock = MOCK_VEHICLES.filter((v) => !isSold(v));
  const n = sold.length || 1;

  return {
    soldCount: sold.length,
    avgLandedCostCents: Math.round(
      sold.reduce((s, v) => s + v.landedCostCents, 0) / n
    ),
    avgNetProfitCents: Math.round(
      sold.reduce((s, v) => s + v.netProfitCents, 0) / n
    ),
    avgDaysToSale: Math.round(sold.reduce((s, v) => s + v.daysInStock, 0) / n),
    totalNetProfitCents: sold.reduce((s, v) => s + v.netProfitCents, 0),
    soldAtLossCount: sold.filter((v) => v.netProfitCents < 0).length,
    inStockCount: inStock.length,
    inStockOver60dCount: inStock.filter((v) => v.daysInStock > 60).length,
  };
}
