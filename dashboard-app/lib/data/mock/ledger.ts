/* Dados fictícios de demonstração. Nenhum dado real da CarNext.
   Financeiro da empresa: contas, categorias e lançamentos gerados de forma
   determinística a partir dos veículos, custos e movimentos de investidor já
   existentes — para que os números conversem com o resto do portal. */

import type {
  CostCenter,
  FinanceAccount,
  LedgerDirection,
  LedgerEntry,
  LedgerGroup,
  LedgerMethod,
} from "../../types";
import { isSold } from "../../types";
import { MOCK_COSTS } from "./costs";
import { MOCK_INVESTORS } from "./investors";
import { MOCK_MOVEMENTS } from "./movements";
import { MOCK_VEHICLES } from "./vehicles";

/** Corte da base de demonstração: até esta data pago; depois, pendente. */
export const FINANCE_REFERENCE_DATE = "2026-09-10";

export const FINANCE_ACCOUNTS: FinanceAccount[] = [
  { id: "cta-principal", name: "Conta corrente principal", kind: "banco", openingBalanceCents: 1500000 },
  { id: "cta-reserva", name: "Conta reserva", kind: "banco", openingBalanceCents: 2000000 },
  { id: "cta-caixa", name: "Caixa da loja", kind: "caixa", openingBalanceCents: 150000 },
];

export interface LedgerCategory {
  key: string;
  label: string;
  direction: LedgerDirection;
  group: LedgerGroup;
  /** Centro de custo sugerido; pode ser trocado no lançamento. */
  costCenter: CostCenter;
}

export const LEDGER_CATEGORIES: LedgerCategory[] = [
  // entradas
  { key: "venda_veiculo", label: "Venda de veículo", direction: "entrada", group: "receita", costCenter: "veiculos" },
  { key: "servicos_locacao", label: "Locação e airport pickup", direction: "entrada", group: "receita", costCenter: "comercial" },
  { key: "outras_receitas", label: "Outras receitas", direction: "entrada", group: "receita", costCenter: "loja" },
  { key: "aporte_investidor", label: "Aporte de investidor", direction: "entrada", group: "capital_investidor", costCenter: "administrativo" },
  // saídas — veículos
  { key: "compra_veiculo", label: "Compra de veículo", direction: "saida", group: "custo_veiculo", costCenter: "veiculos" },
  { key: "preparacao_veiculo", label: "Preparação de veículo", direction: "saida", group: "custo_veiculo", costCenter: "veiculos" },
  { key: "transporte_documentacao", label: "Transporte e documentação", direction: "saida", group: "custo_veiculo", costCenter: "veiculos" },
  // saídas — custo fixo
  { key: "aluguel", label: "Aluguel da loja", direction: "saida", group: "custo_fixo", costCenter: "loja" },
  { key: "folha", label: "Folha de pagamento", direction: "saida", group: "custo_fixo", costCenter: "administrativo" },
  { key: "seguros", label: "Seguros", direction: "saida", group: "custo_fixo", costCenter: "loja" },
  { key: "utilidades", label: "Energia, água e internet", direction: "saida", group: "custo_fixo", costCenter: "loja" },
  { key: "softwares", label: "Softwares e licenças", direction: "saida", group: "custo_fixo", costCenter: "administrativo" },
  { key: "contabilidade", label: "Contabilidade e jurídico", direction: "saida", group: "custo_fixo", costCenter: "administrativo" },
  // saídas — custo variável operacional
  { key: "marketing", label: "Marketing e anúncios", direction: "saida", group: "custo_variavel_operacional", costCenter: "comercial" },
  { key: "comissoes", label: "Comissões de venda", direction: "saida", group: "custo_variavel_operacional", costCenter: "comercial" },
  { key: "deslocamento", label: "Combustível e deslocamento", direction: "saida", group: "custo_variavel_operacional", costCenter: "comercial" },
  { key: "tarifas_bancarias", label: "Tarifas bancárias", direction: "saida", group: "custo_variavel_operacional", costCenter: "administrativo" },
  // saídas — impostos e capital de investidor
  { key: "impostos", label: "Impostos e taxas", direction: "saida", group: "impostos", costCenter: "administrativo" },
  { key: "distribuicao_investidor", label: "Distribuição a investidor", direction: "saida", group: "capital_investidor", costCenter: "administrativo" },
];

/** Gerador pseudoaleatório com semente: a base é sempre a mesma. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PREPARATION = new Set(["mecanica", "funilaria", "detail", "pecas", "outros"]);

export function buildMockLedger(): LedgerEntry[] {
  const random = seeded(2026);
  const entries: LedgerEntry[] = [];
  let seq = 0;

  const vary = (base: number, spread: number) =>
    Math.round((base * (1 - spread + random() * 2 * spread)) / 100) * 100;

  function add(p: {
    date: string;
    category: string;
    description: string;
    amountCents: number;
    counterparty: string;
    method: LedgerMethod;
    accountId?: string;
    vehicleId?: string | null;
    receiptUrl?: string | null;
    dueDate?: string;
    forcePending?: boolean;
  }) {
    const c = LEDGER_CATEGORIES.find((x) => x.key === p.category)!;
    const pending = Boolean(p.forcePending) || p.date > FINANCE_REFERENCE_DATE;
    seq += 1;
    entries.push({
      id: `led-${String(seq).padStart(4, "0")}`,
      date: p.date,
      direction: c.direction,
      group: c.group,
      category: c.key,
      costCenter: c.costCenter,
      description: p.description,
      amountCents: p.amountCents,
      accountId: p.accountId ?? "cta-principal",
      method: p.method,
      counterparty: p.counterparty,
      vehicleId: p.vehicleId ?? null,
      status: pending ? "pendente" : "pago",
      dueDate: pending ? (p.dueDate ?? p.date) : null,
      paidAt: pending ? null : p.date,
      receiptUrl: pending ? null : (p.receiptUrl ?? `/mock/receipts/fin-${String(seq).padStart(4, "0")}.pdf`),
      createdBy: "Bruno Ramos",
      createdAt: `${p.date < FINANCE_REFERENCE_DATE ? p.date : FINANCE_REFERENCE_DATE}T12:00:00Z`,
      reversalOf: null,
      reversedBy: null,
    });
  }

  // Recorrentes, de nov/2025 a set/2026.
  const months: string[] = [];
  for (let y = 2025, m = 11; y < 2026 || (y === 2026 && m <= 9); ) {
    months.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  const day = (month: string, d: number) => `${month}-${String(d).padStart(2, "0")}`;

  for (const month of months) {
    add({ date: day(month, 1), category: "aluguel", description: "Aluguel da loja", amountCents: 650000, counterparty: "Proprietário do imóvel", method: "ach" });
    add({ date: day(month, 5), category: "folha", description: "Folha de pagamento", amountCents: 820000, counterparty: "Equipe CarNext", method: "ach" });
    add({ date: day(month, 7), category: "servicos_locacao", description: "Locações da semana", amountCents: vary(820000, 0.15), counterparty: "Clientes de locação", method: "zelle" });
    add({ date: day(month, 8), category: "marketing", description: "Anúncios online", amountCents: vary(140000, 0.1), counterparty: "Plataformas de anúncio", method: "cartao" });
    add({ date: day(month, 10), category: "seguros", description: "Seguro da loja e da frota", amountCents: 140000, counterparty: "Seguradora", method: "ach" });
    add({ date: day(month, 12), category: "utilidades", description: "Energia, água e internet", amountCents: vary(62000, 0.12), counterparty: "Concessionárias de serviço", method: "ach" });
    add({ date: day(month, 15), category: "softwares", description: "Softwares e licenças", amountCents: 70000, counterparty: "Fornecedores de software", method: "cartao" });
    add({ date: day(month, 16), category: "servicos_locacao", description: "Airport pickup — contratos", amountCents: vary(900000, 0.15), counterparty: "Empresas parceiras", method: "wire" });
    add({ date: day(month, 18), category: "deslocamento", description: "Combustível e pedágios", amountCents: vary(90000, 0.2), counterparty: "Postos e pedágios", method: "cartao" });
    add({ date: day(month, 20), category: "contabilidade", description: "Contabilidade e jurídico", amountCents: 100000, counterparty: "Escritório contábil", method: "wire" });
    add({ date: day(month, 22), category: "marketing", description: "Anúncios em marketplaces", amountCents: vary(140000, 0.1), counterparty: "Marketplaces automotivos", method: "cartao" });
    add({ date: day(month, 25), category: "servicos_locacao", description: "Locações da quinzena", amountCents: vary(760000, 0.15), counterparty: "Clientes de locação", method: "zelle" });
    add({ date: day(month, 26), category: "outras_receitas", description: "Venda de acessórios", amountCents: vary(35000, 0.3), counterparty: "Clientes da loja", method: "dinheiro", accountId: "cta-caixa" });
    add({ date: day(month, 27), category: "deslocamento", description: "Deslocamento — airport pickup", amountCents: vary(30000, 0.3), counterparty: "Motoristas parceiros", method: "dinheiro", accountId: "cta-caixa" });
    add({ date: day(month, 28), category: "tarifas_bancarias", description: "Tarifas bancárias", amountCents: 16000, counterparty: "Banco da conta principal", method: "ach" });
    if (month.endsWith("-01") || month.endsWith("-04") || month.endsWith("-07")) {
      add({ date: day(month, 24), category: "impostos", description: "Impostos do trimestre", amountCents: vary(120000, 0.1), counterparty: "Fisco", method: "ach" });
    }
  }

  // Veículos: compra, venda e comissão. A origem da compra não é registrada.
  for (const v of MOCK_VEHICLES) {
    const name = `${v.year} ${v.make} ${v.model}`;
    add({ date: v.purchaseDate, category: "compra_veiculo", description: `Compra — ${name}`, amountCents: v.acquisitionCostCents, counterparty: "Fornecedor de veículos", method: "wire", vehicleId: v.id });
    if (isSold(v)) {
      add({ date: v.saleDate, category: "venda_veiculo", description: `Venda — ${name}`, amountCents: v.salePriceCents, counterparty: "Cliente final", method: "wire", vehicleId: v.id });
      add({ date: v.saleDate, category: "comissoes", description: `Comissão de venda — ${name}`, amountCents: Math.round((v.salePriceCents * 0.03) / 100) * 100, counterparty: "Equipe de vendas", method: "ach", vehicleId: v.id });
    }
  }

  // Custos por VIN, com o mesmo comprovante do lançamento original.
  for (const c of MOCK_COSTS) {
    add({
      date: c.date,
      category: PREPARATION.has(c.category) ? "preparacao_veiculo" : "transporte_documentacao",
      description: c.description,
      amountCents: c.amountCents,
      counterparty: c.supplier === "CarNext" ? "Taxas e emolumentos" : c.supplier,
      method: "ach",
      vehicleId: c.vehicleId,
      receiptUrl: c.receiptUrl,
    });
  }

  // Capital de investidores: entra na conta principal (a conta bancária é única),
  // passa pelo caixa e fica fora do resultado.
  const investorName = (id: string) => MOCK_INVESTORS.find((i) => i.id === id)?.name ?? "Investidor";
  for (const m of MOCK_MOVEMENTS) {
    if (m.type === "aporte") {
      add({ date: m.date, category: "aporte_investidor", description: "Aporte de investidor", amountCents: m.amountCents, counterparty: investorName(m.investorId), method: "wire" });
    } else if (m.type === "distribuicao_lucro") {
      add({ date: m.date, category: "distribuicao_investidor", description: "Distribuição de lucro", amountCents: m.amountCents, counterparty: investorName(m.investorId), method: "wire" });
    }
  }

  // Contas em aberto já vencidas, para a tela de contas a pagar e receber.
  add({ date: "2026-08-28", category: "utilidades", description: "Manutenção do ar-condicionado da loja", amountCents: 48000, counterparty: "Refrigeração parceira", method: "ach", dueDate: "2026-09-03", forcePending: true });
  add({ date: "2026-08-31", category: "servicos_locacao", description: "Fatura de locação corporativa — agosto", amountCents: 420000, counterparty: "Cliente corporativo", method: "wire", dueDate: "2026-09-05", forcePending: true });

  return entries;
}
