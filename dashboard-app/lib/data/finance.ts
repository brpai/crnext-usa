import type {
  AuditEvent,
  CashFlowMonth,
  CostCenter,
  FinanceOverview,
  LedgerDirection,
  LedgerEntry,
  LedgerGroup,
  LedgerMethod,
  LedgerStatus,
  PendingSummary,
} from "../types";
import { money } from "../format";
import {
  FINANCE_ACCOUNTS,
  LEDGER_CATEGORIES,
  buildMockLedger,
  type LedgerCategory,
} from "./mock/ledger";

/**
 * Financeiro da empresa — SOMENTE ADMIN.
 *
 * Regras:
 *  · valores em centavos, sempre positivos; o sentido está em `direction`;
 *  · nada é apagado: pendente é baixado ou cancelado, pago só se corrige com
 *    estorno (lançamento oposto ligado ao original);
 *  · capital de investidores passa pelo caixa, mas fica FORA do resultado.
 *
 * PROTÓTIPO: lançamentos novos, baixas, cancelamentos e estornos ficam no
 * localStorage deste navegador, sobre a base fictícia de `mock/ledger.ts`.
 *
 * TODO(supabase): tabelas `finance_accounts` e `ledger_entries` com RLS
 * somente admin (is_admin()); comprovantes em bucket privado com URL assinada;
 * estorno e baixa por função no banco; auditoria por trigger; backup diário +
 * exportação para o Google Drive (decisão do Bruno, 2026-09-10).
 */

export { FINANCE_ACCOUNTS, LEDGER_CATEGORIES };
export type { LedgerCategory };

const LEDGER_KEY = "cnx_ledger_v1";
const AUDIT_KEY = "cnx_finance_audit_v1";

export class FinanceError extends Error {}

export interface FinanceActor {
  name: string;
}

export interface NewLedgerEntryInput {
  direction: LedgerDirection;
  category: string;
  costCenter: CostCenter;
  description: string;
  amountCents: number;
  date: string;
  accountId: string;
  method: LedgerMethod;
  counterparty: string;
  vehicleId: string | null;
  status: Exclude<LedgerStatus, "cancelado">;
  dueDate: string | null;
  hasReceipt: boolean;
}

/* ─────────────────────────── Armazenamento local ────────────────────────── */

let memoryLedger: LedgerEntry[] | null = null;
let memoryAudit: AuditEvent[] = [];
let seedCache: LedgerEntry[] | null = null;

function seed(): LedgerEntry[] {
  if (!seedCache) seedCache = buildMockLedger();
  return seedCache;
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = storage()?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    storage()?.setItem(key, JSON.stringify(value));
  } catch {
    /* sem storage (aba privada): fica só em memória */
  }
}

function loadLedger(): LedgerEntry[] {
  const stored = read<LedgerEntry[] | null>(LEDGER_KEY, memoryLedger);
  if (!stored) return seed().map((e) => ({ ...e }));
  const ids = new Set(stored.map((e) => e.id));
  return [...stored, ...seed().filter((e) => !ids.has(e.id))];
}

function saveLedger(entries: LedgerEntry[]) {
  memoryLedger = entries;
  write(LEDGER_KEY, entries);
}

function audit(actor: FinanceActor, action: string, entry: LedgerEntry) {
  const event: AuditEvent = {
    id: `aud-fin-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    actor: actor.name,
    action,
    entity: "LedgerEntry",
    entityId: entry.id,
    detail: `${categoryLabel(entry.category)} — ${money(entry.amountCents)} — ${entry.description}`,
  };
  memoryAudit = [event, ...read(AUDIT_KEY, memoryAudit)];
  write(AUDIT_KEY, memoryAudit);
}

/* ─────────────────────────────── Utilitários ────────────────────────────── */

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function categoryOf(key: string): LedgerCategory | undefined {
  return LEDGER_CATEGORIES.find((c) => c.key === key);
}

export function categoryLabel(key: string): string {
  return categoryOf(key)?.label ?? key;
}

export function accountName(id: string): string {
  return FINANCE_ACCOUNTS.find((a) => a.id === id)?.name ?? id;
}

export function isOverdue(entry: LedgerEntry, today = todayIso()): boolean {
  return entry.status === "pendente" && !!entry.dueDate && entry.dueDate < today;
}

/** Data em que o lançamento mexeu no caixa. */
function cashDate(e: LedgerEntry): string {
  return e.paidAt ?? e.date;
}

function signedCash(e: LedgerEntry): number {
  return e.direction === "entrada" ? e.amountCents : -e.amountCents;
}

/**
 * Efeito no próprio grupo: receita soma entradas, custos somam saídas. Um
 * estorno tem sentido oposto e por isso anula o original dentro do grupo.
 */
function bucketCents(e: LedgerEntry): number {
  const natural: LedgerDirection = e.group === "receita" ? "entrada" : "saida";
  return (e.direction === natural ? 1 : -1) * e.amountCents;
}

/** Valor com o sinal da categoria: estornos entram negativos. */
export function categoryCents(e: LedgerEntry): number {
  const natural = categoryOf(e.category)?.direction ?? e.direction;
  return (e.direction === natural ? 1 : -1) * e.amountCents;
}

function monthsBack(ref: string, n: number): string[] {
  const [y, m] = ref.split("-").map(Number);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(new Date(Date.UTC(y, m - 1 - i, 1)).toISOString().slice(0, 7));
  }
  return out;
}

/* ──────────────────────────────── Leitura ───────────────────────────────── */

/** Mais recentes primeiro. */
export async function listLedgerEntries(): Promise<LedgerEntry[]> {
  return loadLedger().sort((a, b) =>
    a.date === b.date ? (a.id < b.id ? 1 : -1) : a.date < b.date ? 1 : -1
  );
}

export async function listFinanceAuditEvents(): Promise<AuditEvent[]> {
  return read(AUDIT_KEY, memoryAudit);
}

export async function getFinanceOverview(periodMonths: number): Promise<FinanceOverview> {
  const entries = loadLedger();
  const today = todayIso();
  const paid = entries.filter((e) => e.status === "pago" && cashDate(e) <= today);

  // Mês de referência: o último com lançamento pago (a base fictícia termina em set/2026).
  const lastPaid = paid.reduce((max, e) => (cashDate(e) > max ? cashDate(e) : max), "");
  const referenceMonth = (lastPaid || today).slice(0, 7);
  const months = monthsBack(referenceMonth, periodMonths);
  const monthSet = new Set(months);

  const flow = new Map<string, CashFlowMonth>(
    months.map((month) => [month, { month, inCents: 0, outCents: 0, resultCents: 0 }])
  );
  const byGroup = new Map<LedgerGroup, number>();
  const byCenter = new Map<CostCenter, number>();
  let investorNet = 0;

  for (const e of paid) {
    const month = cashDate(e).slice(0, 7);
    if (e.group === "capital_investidor") {
      if (month === referenceMonth) investorNet += signedCash(e);
      continue;
    }
    if (!monthSet.has(month)) continue;
    const row = flow.get(month)!;
    const value = bucketCents(e);
    if (e.group === "receita") {
      row.inCents += value;
    } else {
      row.outCents += value;
      byGroup.set(e.group, (byGroup.get(e.group) ?? 0) + value);
      byCenter.set(e.costCenter, (byCenter.get(e.costCenter) ?? 0) + value);
    }
  }

  const cashFlow = months.map((m) => {
    const row = flow.get(m)!;
    return { ...row, resultCents: row.inCents - row.outCents };
  });
  const current = cashFlow[cashFlow.length - 1];

  const accounts = FINANCE_ACCOUNTS.map((account) => ({
    account,
    balanceCents:
      account.openingBalanceCents +
      paid.filter((e) => e.accountId === account.id).reduce((n, e) => n + signedCash(e), 0),
  }));

  const pending = entries.filter((e) => e.status === "pendente");
  const summarize = (direction: LedgerDirection): PendingSummary => {
    const list = pending.filter((e) => e.direction === direction);
    const overdue = list.filter((e) => isOverdue(e, today));
    return {
      count: list.length,
      cents: list.reduce((n, e) => n + e.amountCents, 0),
      overdueCount: overdue.length,
      overdueCents: overdue.reduce((n, e) => n + e.amountCents, 0),
    };
  };

  return {
    referenceMonth,
    months,
    month: {
      inCents: current.inCents,
      outCents: current.outCents,
      resultCents: current.resultCents,
      investorNetCents: investorNet,
    },
    cashBalanceCents: accounts.reduce((n, a) => n + a.balanceCents, 0),
    accounts,
    cashFlow,
    outByGroup: [...byGroup.entries()]
      .map(([group, cents]) => ({ group, cents }))
      .sort((a, b) => b.cents - a.cents),
    outByCostCenter: [...byCenter.entries()]
      .map(([costCenter, cents]) => ({ costCenter, cents }))
      .sort((a, b) => b.cents - a.cents),
    payables: summarize("saida"),
    receivables: summarize("entrada"),
  };
}

/* ──────────────────────────────── Escrita ───────────────────────────────── */

export async function createLedgerEntry(
  input: NewLedgerEntryInput,
  actor: FinanceActor
): Promise<LedgerEntry> {
  const category = categoryOf(input.category);
  if (!category || category.direction !== input.direction)
    throw new FinanceError("Escolha uma categoria válida para o tipo de lançamento.");
  if (!input.description.trim()) throw new FinanceError("Descreva o lançamento.");
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0)
    throw new FinanceError("Informe um valor maior que zero.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new FinanceError("Informe a data.");
  if (!FINANCE_ACCOUNTS.some((a) => a.id === input.accountId))
    throw new FinanceError("Escolha a conta.");
  if (input.status === "pendente" && !input.dueDate)
    throw new FinanceError("Informe o vencimento da conta pendente.");

  const entry: LedgerEntry = {
    id: `led-local-${Date.now().toString(36)}`,
    date: input.date,
    direction: category.direction,
    group: category.group,
    category: category.key,
    costCenter: input.costCenter,
    description: input.description.trim(),
    amountCents: input.amountCents,
    accountId: input.accountId,
    method: input.method,
    counterparty: input.counterparty.trim() || "—",
    vehicleId: input.vehicleId,
    status: input.status,
    dueDate: input.status === "pendente" ? input.dueDate : null,
    paidAt: input.status === "pago" ? input.date : null,
    // TODO(supabase): upload real no bucket privado de comprovantes.
    receiptUrl: input.hasReceipt ? "local://comprovante" : null,
    createdBy: actor.name,
    createdAt: new Date().toISOString(),
    reversalOf: null,
    reversedBy: null,
  };
  saveLedger([...loadLedger(), entry]);
  audit(actor, entry.direction === "entrada" ? "lançou entrada" : "lançou saída", entry);
  return entry;
}

/** Baixa de conta pendente: pagamento (saída) ou recebimento (entrada). */
export async function markLedgerEntryPaid(
  id: string,
  actor: FinanceActor,
  paidAt: string = todayIso()
): Promise<LedgerEntry> {
  const entries = loadLedger();
  const entry = entries.find((e) => e.id === id);
  if (!entry || entry.status !== "pendente")
    throw new FinanceError("Só contas pendentes podem receber baixa.");
  const updated: LedgerEntry = { ...entry, status: "pago", paidAt };
  saveLedger(entries.map((e) => (e.id === id ? updated : e)));
  audit(actor, entry.direction === "entrada" ? "baixou recebimento" : "baixou pagamento", updated);
  return updated;
}

/** Cancela uma conta pendente lançada por engano. Continua visível como cancelada. */
export async function cancelLedgerEntry(id: string, actor: FinanceActor): Promise<LedgerEntry> {
  const entries = loadLedger();
  const entry = entries.find((e) => e.id === id);
  if (!entry || entry.status !== "pendente")
    throw new FinanceError("Só contas pendentes podem ser canceladas. Lançamento pago se corrige com estorno.");
  const updated: LedgerEntry = { ...entry, status: "cancelado", dueDate: entry.dueDate };
  saveLedger(entries.map((e) => (e.id === id ? updated : e)));
  audit(actor, "cancelou lançamento", updated);
  return updated;
}

/** Estorno: cria o lançamento oposto, ligado ao original. Nada é apagado. */
export async function reverseLedgerEntry(id: string, actor: FinanceActor): Promise<LedgerEntry> {
  const entries = loadLedger();
  const original = entries.find((e) => e.id === id);
  if (!original) throw new FinanceError("Lançamento não encontrado.");
  if (original.status !== "pago")
    throw new FinanceError("Só lançamentos pagos são estornados. Conta pendente se cancela.");
  if (original.reversalOf) throw new FinanceError("Este lançamento já é um estorno.");
  if (original.reversedBy) throw new FinanceError("Este lançamento já foi estornado.");

  const today = todayIso();
  const reversal: LedgerEntry = {
    ...original,
    id: `led-local-${Date.now().toString(36)}`,
    date: today,
    direction: original.direction === "entrada" ? "saida" : "entrada",
    description: `Estorno — ${original.description}`,
    status: "pago",
    dueDate: null,
    paidAt: today,
    receiptUrl: null,
    createdBy: actor.name,
    createdAt: new Date().toISOString(),
    reversalOf: original.id,
    reversedBy: null,
  };
  saveLedger([
    ...entries.map((e) => (e.id === id ? { ...e, reversedBy: reversal.id } : e)),
    reversal,
  ]);
  audit(actor, "estornou lançamento", original);
  return reversal;
}
