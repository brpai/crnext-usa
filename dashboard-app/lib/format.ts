import type { Cents, IsoDate, IsoTimestamp } from "./types";

/**
 * Formatação. Dinheiro circula como inteiro em centavos por todo o app e só
 * vira string aqui, na borda de apresentação.
 */

const usd = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** US$ 12.345,67 */
export function money(cents: Cents): string {
  return usd.format(cents / 100);
}

/** US$ 12.346 — para cards e eixos de gráfico. */
export function moneyShort(cents: Cents): string {
  return usdCompact.format(cents / 100);
}

/** Sempre com sinal explícito. Usado onde lucro e prejuízo convivem. */
export function moneySigned(cents: Cents): string {
  const s = money(Math.abs(cents));
  if (cents > 0) return `+${s}`;
  if (cents < 0) return `−${s}`;
  return s;
}

export function percent(value: number, digits = 1): string {
  return `${value.toFixed(digits).replace(".", ",")}%`;
}

export function miles(value: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(value)} mi`;
}

const dtf = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const dtfLong = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** 18/04/2026 */
export function date(iso: IsoDate | IsoTimestamp): string {
  return dtf.format(new Date(iso));
}

/** 18 de abr. de 2026 */
export function dateLong(iso: IsoDate | IsoTimestamp): string {
  return dtfLong.format(new Date(iso));
}

/** 18/04/2026 14:32 */
export function dateTime(iso: IsoTimestamp): string {
  const d = new Date(iso);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(d);
  return `${dtf.format(d)} ${time}`;
}

/** "2026-03" → "mar/26" */
export function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  const names = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${names[Number(m) - 1]}/${y.slice(2)}`;
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? `${n} ${one}` : `${n} ${many}`;
}

/* ───────────────────────────── Rótulos de domínio ───────────────────────── */

export const VEHICLE_STATUS_LABEL: Record<string, string> = {
  em_preparo: "Em preparo",
  a_venda: "À venda",
  vendido: "Vendido",
};

/** Status exibido ao investidor para veículo ainda não vendido. */
export const IN_STOCK_STATUS_LABEL =
  "Em estoque — resultado apurado somente na venda";

export const COST_CATEGORY_LABEL: Record<string, string> = {
  aquisicao_taxas: "Taxas de aquisição",
  transporte: "Transporte",
  mecanica: "Mecânica",
  funilaria: "Funilaria",
  detail: "Detail",
  pecas: "Peças",
  documentacao: "Documentação",
  outros: "Outros",
};

export const MOVEMENT_LABEL: Record<string, string> = {
  aporte: "Aporte",
  alocacao: "Alocação em veículo",
  devolucao: "Devolução de capital",
  distribuicao_lucro: "Distribuição de lucro",
};

export const REQUEST_STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  em_analise: "Em análise",
  aprovado: "Aprovado",
  recusado: "Recusado",
};

export const CONTRACT_STATUS_LABEL: Record<string, string> = {
  vigente: "Vigente",
  encerrado: "Encerrado",
  pendente_assinatura: "Pendente de assinatura",
};

export const TICKET_STATUS_LABEL: Record<string, string> = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  resolvido: "Resolvido",
};

export const TICKET_CATEGORY_LABEL: Record<string, string> = {
  financeiro: "Financeiro",
  contrato: "Contrato",
  veiculo: "Veículo",
  documentacao: "Documentação",
  outro: "Outro",
};

export const METHOD_LABEL: Record<string, string> = {
  zelle: "Zelle",
  wire: "Wire transfer",
  ach: "ACH",
  cheque: "Cheque",
  outro: "Outro",
};

export const ROLE_LABEL: Record<string, string> = {
  investidor: "Investidor",
  colaborador: "Colaborador",
  admin: "Admin",
};

/* ─────────────────────────────────── Aging ──────────────────────────────── */

export type AgingTone = "ok" | "atencao" | "critico";

export function agingTone(days: number): AgingTone {
  if (days < 30) return "ok";
  if (days <= 60) return "atencao";
  return "critico";
}

export function vehicleLabel(v: {
  year: number;
  make: string;
  model: string;
  trim?: string;
}): string {
  return `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ""}`;
}

/* ─────────────────────────────── Financeiro ─────────────────────────────── */

export const LEDGER_GROUP_LABEL: Record<string, string> = {
  receita: "Receita",
  custo_veiculo: "Custo de veículos",
  custo_fixo: "Custo fixo",
  custo_variavel_operacional: "Custo variável operacional",
  impostos: "Impostos e taxas",
  capital_investidor: "Capital de investidores",
};

export const COST_CENTER_LABEL: Record<string, string> = {
  loja: "Loja",
  veiculos: "Veículos",
  comercial: "Comercial",
  administrativo: "Administrativo",
};

export const LEDGER_METHOD_LABEL: Record<string, string> = {
  zelle: "Zelle",
  wire: "Wire transfer",
  ach: "ACH",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
  cheque: "Cheque",
};
