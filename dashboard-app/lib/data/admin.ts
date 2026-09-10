import type {
  AdminOverview,
  Allocation,
  AuditEvent,
  Cents,
  InvestorPositionRow,
  Vehicle,
} from "../types";
import { isSold } from "../types";
import { MOCK_ALLOCATIONS } from "./mock/allocations";
import { MOCK_AUDIT } from "./mock/audit";
import { MOCK_INVESTORS } from "./mock/investors";
import { MOCK_MOVEMENTS } from "./mock/movements";
import { MOCK_VEHICLES } from "./mock/vehicles";
import { MOCK_COMPANY_CASH_CENTS, MOCK_OPERATING } from "./mock/operating";
import { listAccessAuditEvents } from "./access";

/**
 * Agregados do painel administrativo.
 *
 * TODO(supabase): views materializadas ou RPC no Postgres. RLS: todo este
 * módulo exige papel admin — nenhuma destas funções pode ser exposta ao
 * investidor.
 */

const CURRENT_MONTH = "2026-09"; // TODO(supabase): derivar de now()
const REPORT_MONTH = "2026-07"; // último mês com venda fechada nos mocks

function soldVehicleIds(): Set<string> {
  return new Set(MOCK_VEHICLES.filter(isSold).map((v) => v.id));
}

export async function listAllocations(): Promise<Allocation[]> {
  return [...MOCK_ALLOCATIONS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getVehicleAllocations(
  vehicleId: string
): Promise<Allocation[]> {
  return MOCK_ALLOCATIONS.filter((a) => a.vehicleId === vehicleId);
}

export async function getInvestorAllocations(
  investorId: string
): Promise<Allocation[]> {
  return MOCK_ALLOCATIONS.filter((a) => a.investorId === investorId);
}

/** Quanto do custo do veículo já está coberto por capital de investidores. */
export async function getVehicleFunding(vehicleId: string): Promise<{
  vehicle: Vehicle | null;
  allocatedCents: Cents;
  freeCapacityCents: Cents;
}> {
  const vehicle = MOCK_VEHICLES.find((v) => v.id === vehicleId) ?? null;
  const allocated = MOCK_ALLOCATIONS.filter(
    (a) => a.vehicleId === vehicleId
  ).reduce((n, a) => n + a.amountCents, 0);
  return {
    vehicle,
    allocatedCents: allocated,
    freeCapacityCents: vehicle ? vehicle.landedCostCents - allocated : 0,
  };
}

function positionRows(): InvestorPositionRow[] {
  const sold = soldVehicleIds();
  return MOCK_INVESTORS.map((investor) => {
    const allocated = MOCK_ALLOCATIONS.filter(
      (a) => a.investorId === investor.id && !sold.has(a.vehicleId)
    ).reduce((n, a) => n + a.amountCents, 0);
    const contributed = MOCK_MOVEMENTS.filter(
      (m) => m.investorId === investor.id && m.type === "aporte"
    ).reduce((n, m) => n + m.amountCents, 0);
    const paid = MOCK_MOVEMENTS.filter(
      (m) => m.investorId === investor.id && m.type === "distribuicao_lucro"
    ).reduce((n, m) => n + m.amountCents, 0);
    return {
      investor,
      contributedCents: contributed,
      allocatedCents: allocated,
      availableCents: contributed - allocated,
      paidProfitCents: paid,
    };
  }).sort((a, b) => b.contributedCents - a.contributedCents);
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const rows = positionRows();
  const inStock = MOCK_VEHICLES.filter((v) => !isSold(v));

  const investorPositions = rows.reduce((n, r) => n + r.availableCents, 0);
  const difference = MOCK_COMPANY_CASH_CENTS - investorPositions;

  const monthSold = MOCK_VEHICLES.filter(
    (v) => isSold(v) && v.saleDate.slice(0, 7) === REPORT_MONTH
  ).filter(isSold);

  const buckets = [
    { label: "0–29 dias", count: inStock.filter((v) => v.daysInStock < 30).length },
    {
      label: "30–60 dias",
      count: inStock.filter((v) => v.daysInStock >= 30 && v.daysInStock <= 60).length,
    },
    { label: "60+ dias", count: inStock.filter((v) => v.daysInStock > 60).length },
  ];

  return {
    capitalUnderManagementCents: rows.reduce(
      (n, r) => n + r.allocatedCents + r.availableCents,
      0
    ),
    positions: rows,
    reconciliation: {
      companyCashCents: MOCK_COMPANY_CASH_CENTS,
      investorPositionsCents: investorPositions,
      differenceCents: difference,
      matches: difference >= 0,
    },
    stock: {
      vehicleCount: inStock.length,
      immobilizedCents: inStock.reduce((n, v) => n + v.landedCostCents, 0),
      avgAgingDays: inStock.length
        ? Math.round(
            inStock.reduce((n, v) => n + v.daysInStock, 0) / inStock.length
          )
        : 0,
      agingBuckets: buckets,
    },
    monthSales: {
      month: REPORT_MONTH,
      soldCount: monthSold.length,
      grossProfitCents: monthSold.reduce((n, v) => n + v.grossProfitCents, 0),
      netProfitCents: monthSold.reduce((n, v) => n + v.netProfitCents, 0),
    },
    pnl: {
      fixedOperatingCents: MOCK_OPERATING.fixedOperatingCents,
      // custo variável por veículo = soma dos custos lançados por VIN no estoque atual
      variablePerVehicleCents: inStock.reduce(
        (n, v) => n + v.variableCostsCents,
        0
      ),
      variableOperatingCents: MOCK_OPERATING.variableOperatingCents,
    },
  };
}

export async function getAuditLog(): Promise<AuditEvent[]> {
  const access = await listAccessAuditEvents();
  return [...access, ...MOCK_AUDIT].sort((a, b) => (a.at < b.at ? 1 : -1));
}

export const ADMIN_CURRENT_MONTH = CURRENT_MONTH;
