/**
 * Modelo de domínio do Portal do Investidor CarNext.
 *
 * Estes tipos são o CONTRATO do backend futuro (Supabase/Postgres). Ao trocar o
 * mock por consultas reais, as assinaturas de `lib/data/*` não mudam.
 *
 * REGRAS CODIFICADAS NO TIPO (não são convenção — o compilador cobra):
 *  1. Todo valor monetário é INTEIRO EM CENTAVOS. Nunca float.
 *  2. Resultado (preço de venda, lucro, share do investidor) só existe em
 *     veículo com `status === 'vendido'`. Em veículo não vendido esses campos
 *     não existem no tipo — não são zero, não são null-opcional-esquecido.
 *     Ver a união discriminada `Vehicle` abaixo.
 */

/** Valor monetário em centavos de USD. 1234567 = US$ 12.345,67 */
export type Cents = number;

/** Data ISO 8601, somente data: "2026-04-18" */
export type IsoDate = string;

/** Timestamp ISO 8601 completo: "2026-04-18T14:32:00Z" */
export type IsoTimestamp = string;

/* ────────────────────────────── Papéis / auth ───────────────────────────── */

export type Role = "investidor" | "colaborador" | "admin";

export interface SessionUser {
  role: Role;
  /** Preenchido apenas quando role === 'investidor'. */
  investorId: string | null;
  displayName: string;
  /** E-mail autorizado com que a pessoa entrou. */
  email: string;
}

/* ─────────────────────────── Acessos autorizados ────────────────────────── */

export type AccessStatus = "ativo" | "revogado";

/**
 * Autorização de acesso ao portal. Só entra quem tem uma linha ATIVA aqui —
 * é a lista de e-mails autorizados, mantida por um admin na tela Acessos.
 *
 * O papel da pessoa vem daqui, nunca de uma escolha feita no login.
 */
export interface AccessGrant {
  id: string;
  /** Sempre minúsculo e sem espaços. Único entre os acessos ativos. */
  email: string;
  name: string;
  role: Role;
  /** Obrigatório quando role === 'investidor'; null nos demais papéis. */
  investorId: string | null;
  status: AccessStatus;
  createdAt: IsoTimestamp;
  createdBy: string;
  revokedAt: IsoTimestamp | null;
  revokedBy: string | null;
  lastLoginAt: IsoTimestamp | null;
}

/* ──────────────────────────────── Investidor ────────────────────────────── */

export type InvestorStatus = "ativo" | "inativo";

export interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: IsoDate;
  status: InvestorStatus;
  /** Soma histórica de todos os aportes recebidos. */
  contributedCents: Cents;
  /** Soma das alocações ativas em veículos ainda não vendidos. */
  allocatedCents: Cents;
  /** contributedCents − allocatedCents. Capital em caixa, não alocado. */
  availableCents: Cents;
  /** Soma das distribuições já pagas. Somente de veículos vendidos. */
  realizedProfitCents: Cents;
  contractIds: string[];
}

/* ───────────────────────────────── Veículo ──────────────────────────────── */

export type VehicleStatus = "em_preparo" | "a_venda" | "vendido";

export type CostCategory =
  | "aquisicao_taxas"
  | "transporte"
  | "mecanica"
  | "funilaria"
  | "detail"
  | "pecas"
  | "documentacao"
  | "outros";

export interface VehicleCost {
  id: string;
  vehicleId: string;
  category: CostCategory;
  description: string;
  amountCents: Cents;
  date: IsoDate;
  supplier: string;
  /** URL fictícia do comprovante. TODO: Supabase Storage. */
  receiptUrl: string | null;
}

/** Campos comuns a qualquer veículo, vendido ou não. */
interface VehicleBase {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  color: string;
  purchaseDate: IsoDate;
  /**
   * A ORIGEM DA AQUISIÇÃO NÃO É MODELADA DE PROPÓSITO.
   * Onde o veículo foi comprado (leilão, casa, praça) é informação comercial
   * sensível da CarNext e não deve trafegar para o portal do investidor —
   * nem visível na tela, nem no payload da página. Se um dia for preciso no
   * admin, entra em tabela separada, com leitura restrita a admin.
   */
  photos: string[];
  /** Preço de aquisição, sem custos variáveis. */
  acquisitionCostCents: Cents;
  /** Soma dos VehicleCost do veículo. */
  variableCostsCents: Cents;
  /** landed = acquisitionCostCents + variableCostsCents. */
  landedCostCents: Cents;
  /** Preço pedido no anúncio. Não é previsão de venda. */
  askingPriceCents: Cents;
  timeline: VehicleTimelineEvent[];
}

/**
 * Veículo ainda não vendido. Não possui — e não pode possuir — campo de
 * resultado. Qualquer tentativa de ler `netProfitCents` aqui é erro de tipo.
 */
export interface VehicleInStock extends VehicleBase {
  status: "em_preparo" | "a_venda";
  /** Dias corridos desde a compra até hoje. */
  daysInStock: number;
}

/** Veículo vendido. Só aqui existem resultado e share do investidor. */
export interface VehicleSold extends VehicleBase {
  status: "vendido";
  /** Dias entre compra e venda (fechado, não corre mais). */
  daysInStock: number;
  salePriceCents: Cents;
  saleDate: IsoDate;
  /** salePriceCents − acquisitionCostCents. */
  grossProfitCents: Cents;
  /** salePriceCents − landedCostCents. Pode ser negativo. */
  netProfitCents: Cents;
}

export type Vehicle = VehicleInStock | VehicleSold;

/** Type guard: estreita para o único tipo em que resultado pode ser exibido. */
export function isSold(v: Vehicle): v is VehicleSold {
  return v.status === "vendido";
}

export interface VehicleTimelineEvent {
  label: string;
  date: IsoDate;
  note?: string;
}

/* ──────────────────────────────── Alocação ──────────────────────────────── */

/** Fraciona o capital: um veículo pode ter N investidores. */
export interface Allocation {
  id: string;
  investorId: string;
  vehicleId: string;
  amountCents: Cents;
  /** Participação no capital DAQUELE veículo, 0–100. */
  sharePercent: number;
  date: IsoDate;
}

/** Percentual do lucro líquido do veículo devido ao conjunto de investidores. */
export const INVESTOR_PROFIT_SHARE = 0.3;

/* ───────────────────────────── Extrato (caixa) ──────────────────────────── */

export type MovementType =
  | "aporte"
  | "alocacao"
  | "devolucao"
  | "distribuicao_lucro";

export interface CapitalMovement {
  id: string;
  investorId: string;
  type: MovementType;
  /** Positivo entra na posição do investidor, negativo sai. */
  amountCents: Cents;
  date: IsoDate;
  vehicleId: string | null;
  bankReference: string;
  note: string;
}

/* ──────────────────────────────── Contrato ──────────────────────────────── */

export type ContractStatus = "vigente" | "encerrado" | "pendente_assinatura";

export interface Contract {
  id: string;
  investorId: string;
  title: string;
  signedAt: IsoDate;
  /** Vigência do acordo. NÃO é prazo de pagamento. */
  validFrom: IsoDate;
  validUntil: IsoDate;
  status: ContractStatus;
  /** URL fictícia. TODO: Supabase Storage. */
  pdfUrl: string;
  /** Termos em linguagem simples, exibidos acima do documento formal. */
  summaryBullets: string[];
}

/* ─────────────────────────── Solicitação de aporte ──────────────────────── */

export type CapitalRequestStatus =
  | "pendente"
  | "em_analise"
  | "aprovado"
  | "recusado";

export type TransferMethod = "zelle" | "wire" | "ach" | "cheque" | "outro";

export interface CapitalRequest {
  id: string;
  investorId: string;
  amountCents: Cents;
  method: TransferMethod;
  message: string;
  status: CapitalRequestStatus;
  createdAt: IsoTimestamp;
  respondedAt: IsoTimestamp | null;
  adminResponse: string | null;
}

/* ───────────────────────────────── Suporte ──────────────────────────────── */

export type TicketStatus = "aberto" | "em_andamento" | "resolvido";
export type TicketPriority = "baixa" | "normal" | "alta";
export type TicketCategory =
  | "financeiro"
  | "contrato"
  | "veiculo"
  | "documentacao"
  | "outro";

export interface TicketMessage {
  id: string;
  author: "investidor" | "carnext";
  authorName: string;
  body: string;
  createdAt: IsoTimestamp;
}

export interface SupportTicket {
  id: string;
  investorId: string;
  subject: string;
  category: TicketCategory;
  messages: TicketMessage[];
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

/* ──────────────────────────────── Auditoria ─────────────────────────────── */

export interface AuditEvent {
  id: string;
  at: IsoTimestamp;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  detail: string;
}

/* ───────────────────────── Agregados de apresentação ────────────────────── */

/** Ponto do histórico realizado. Somente meses passados. */
export interface RealizedMonthPoint {
  /** "2026-03" */
  month: string;
  allocatedCents: Cents;
  distributedCents: Cents;
}

/** Quanto do capital do investidor está em cada veículo. */
export interface CapitalByVehicleSlice {
  vehicleId: string;
  label: string;
  amountCents: Cents;
  percent: number;
}

/** Posição do investidor num veículo específico. */
export interface InvestorPosition {
  vehicle: Vehicle;
  allocation: Allocation;
  /** Nº de investidores no mesmo carro (inclui ele). */
  coInvestorCount: number;
  /** Percentuais dos demais, sem identificar quem são. */
  otherSharePercents: number[];
  /**
   * Share do investidor no lucro líquido — 30% pro-rata da participação dele.
   * `null` enquanto o veículo não foi vendido: não há resultado a apurar.
   */
  realizedShareCents: Cents | null;
  /** Data do pagamento da distribuição. `null` se ainda não vendido/pago. */
  paidAt: IsoDate | null;
}

export interface InvestorAlert {
  kind: "aging" | "solicitacao" | "contrato";
  severity: "info" | "atencao";
  title: string;
  detail: string;
  href?: string;
}

/** Tudo que a visão geral do investidor precisa. */
export interface InvestorPortfolio {
  investor: Investor;
  positions: InvestorPosition[];
  inStockCount: number;
  soldCount: number;
  realizedHistory: RealizedMonthPoint[];
  capitalByVehicle: CapitalByVehicleSlice[];
  alerts: InvestorAlert[];
}

/**
 * Histórico agregado da operação — SOMENTE fatos de veículos já vendidos,
 * mais a contagem do que ainda está em estoque (inclusive aging alto).
 * Nada aqui é projeção.
 */
export interface RealizedTrackRecord {
  soldCount: number;
  avgLandedCostCents: Cents;
  avgNetProfitCents: Cents;
  /** Média de dias em estoque DOS QUE JÁ VENDERAM. */
  avgDaysToSale: number;
  totalNetProfitCents: Cents;
  /** Quantos dos vendidos deram prejuízo. Exibido com o mesmo destaque. */
  soldAtLossCount: number;
  inStockCount: number;
  inStockOver60dCount: number;
}

/* ───────────────────────────── Agregados admin ──────────────────────────── */

export interface InvestorPositionRow {
  investor: Investor;
  contributedCents: Cents;
  allocatedCents: Cents;
  availableCents: Cents;
  paidProfitCents: Cents;
}

export interface AgingBucket {
  label: string;
  count: number;
}

/** P&L em três buckets separados. Não se misturam. */
export interface PnlBuckets {
  fixedOperatingCents: Cents;
  variablePerVehicleCents: Cents;
  variableOperatingCents: Cents;
}

export interface AdminOverview {
  capitalUnderManagementCents: Cents;
  positions: InvestorPositionRow[];
  /** Caixa da empresa vs. soma das posições dos investidores. */
  reconciliation: {
    companyCashCents: Cents;
    investorPositionsCents: Cents;
    differenceCents: Cents;
    matches: boolean;
  };
  stock: {
    vehicleCount: number;
    immobilizedCents: Cents;
    avgAgingDays: number;
    agingBuckets: AgingBucket[];
  };
  monthSales: {
    month: string;
    soldCount: number;
    grossProfitCents: Cents;
    netProfitCents: Cents;
  };
  pnl: PnlBuckets;
}

/* ─────────────────────────── Financeiro da empresa ──────────────────────── */

export type LedgerDirection = "entrada" | "saida";

/**
 * Grupo do lançamento. Define se ele entra no RESULTADO da empresa.
 * `capital_investidor` passa pelo caixa (aporte, distribuição), mas nunca é
 * receita nem despesa da CarNext.
 */
export type LedgerGroup =
  | "receita"
  | "custo_veiculo"
  | "custo_fixo"
  | "custo_variavel_operacional"
  | "impostos"
  | "capital_investidor";

export type CostCenter = "loja" | "veiculos" | "comercial" | "administrativo";

export type LedgerMethod = "zelle" | "wire" | "ach" | "cartao" | "dinheiro" | "cheque";

/** Nada é apagado: pendente vira pago, ou é cancelado; pago só se corrige com estorno. */
export type LedgerStatus = "pago" | "pendente" | "cancelado";

export interface FinanceAccount {
  id: string;
  name: string;
  kind: "banco" | "caixa";
  openingBalanceCents: Cents;
}

export interface LedgerEntry {
  id: string;
  /** Data do lançamento (pagamento, recebimento ou emissão, se pendente). */
  date: IsoDate;
  direction: LedgerDirection;
  group: LedgerGroup;
  category: string;
  costCenter: CostCenter;
  description: string;
  /** Sempre positivo. O sentido está em `direction`. */
  amountCents: Cents;
  accountId: string;
  method: LedgerMethod;
  counterparty: string;
  vehicleId: string | null;
  status: LedgerStatus;
  /** Vencimento — obrigatório enquanto pendente. */
  dueDate: IsoDate | null;
  paidAt: IsoDate | null;
  receiptUrl: string | null;
  createdBy: string;
  createdAt: IsoTimestamp;
  /** Este lançamento é estorno de outro. */
  reversalOf: string | null;
  /** Este lançamento foi anulado pelo estorno indicado. */
  reversedBy: string | null;
}

/** Um mês do fluxo de caixa. Somente lançamentos pagos, sem capital de investidor. */
export interface CashFlowMonth {
  month: string;
  inCents: Cents;
  outCents: Cents;
  resultCents: Cents;
}

export interface PendingSummary {
  count: number;
  cents: Cents;
  overdueCount: number;
  overdueCents: Cents;
}

export interface FinanceOverview {
  referenceMonth: string;
  months: string[];
  month: {
    inCents: Cents;
    outCents: Cents;
    resultCents: Cents;
    /** Aportes menos distribuições no mês — fora do resultado. */
    investorNetCents: Cents;
  };
  cashBalanceCents: Cents;
  accounts: Array<{ account: FinanceAccount; balanceCents: Cents }>;
  cashFlow: CashFlowMonth[];
  outByGroup: Array<{ group: LedgerGroup; cents: Cents }>;
  outByCostCenter: Array<{ costCenter: CostCenter; cents: Cents }>;
  payables: PendingSummary;
  receivables: PendingSummary;
}
