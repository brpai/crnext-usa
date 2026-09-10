import * as React from "react";
import { money, moneySigned, agingTone, percent } from "@/lib/format";
import { Badge, Card, cn } from "@/components/ui";
import { CARD_RESULT_PLACEHOLDER, RESULT_ON_SALE_ONLY } from "@/lib/copy";
import type { Cents } from "@/lib/types";

/* ────────────────────────────── Valores ────────────────────────────────── */

/**
 * Valor de resultado. Prejuízo recebe o MESMO peso visual do lucro —
 * mesmo tamanho, mesma fonte, mesma posição. Só a cor muda.
 */
export function ResultValue({
  cents,
  size = "md",
  showSign = true,
}: {
  cents: Cents;
  size?: "sm" | "md" | "lg";
  showSign?: boolean;
}) {
  const tone =
    cents > 0 ? "text-gain" : cents < 0 ? "text-loss" : "text-brand-white";
  const sizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-3xl",
  } as const;
  return (
    <span className={cn("font-semibold tabular", sizes[size], tone)}>
      {showSign ? moneySigned(cents) : money(cents)}
    </span>
  );
}

export function Money({
  cents,
  className,
}: {
  cents: Cents;
  className?: string;
}) {
  return <span className={cn("tabular", className)}>{money(cents)}</span>;
}

/* ─────────────────────────────── Stat card ─────────────────────────────── */

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "neutral" | "gain" | "loss";
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tabular",
          tone === "gain" && "text-gain",
          tone === "loss" && "text-loss",
          tone === "neutral" && "text-brand-white"
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-[11px] leading-relaxed text-brand-muted">{hint}</p>
      ) : null}
    </Card>
  );
}

/* ──────────────────────────────── Aging ────────────────────────────────── */

export function AgingBadge({ days }: { days: number }) {
  const tone = agingTone(days);
  const map = { ok: "ok", atencao: "atencao", critico: "critico" } as const;
  return (
    <Badge tone={map[tone]}>
      {days} {days === 1 ? "dia" : "dias"} em estoque
    </Badge>
  );
}

/* ─────────────────────────── Status do veículo ─────────────────────────── */

/**
 * Status exibido ao investidor. Para veículo não vendido o rótulo diz
 * explicitamente que o resultado só é apurado na venda.
 */
export function VehicleStatusBadge({
  status,
}: {
  status: "em_preparo" | "a_venda" | "vendido";
}) {
  if (status === "vendido") return <Badge tone="ok">Vendido</Badge>;
  return (
    <Badge tone="neutral">
      {status === "em_preparo" ? "Em preparo · " : "À venda · "}
      {RESULT_ON_SALE_ONLY.toLowerCase()}
    </Badge>
  );
}

/** Ocupa, no card de veículo não vendido, o espaço que o vendido usa para lucro. */
export function ResultPlaceholder() {
  return (
    <p className="text-xs leading-relaxed text-brand-muted">
      {CARD_RESULT_PLACEHOLDER}
    </p>
  );
}

/* ──────────────────────────── Cascata de custos ────────────────────────── */

export type WaterfallStep = {
  label: string;
  cents: Cents;
  kind: "base" | "add" | "subtotal" | "sale" | "result" | "share";
  hint?: string;
};

/**
 * Cascata financeira. Recebe apenas os passos que a tela montou — a decisão
 * de onde a cascata PARA é de quem chama (veículo em estoque para no custo
 * final; vendido segue até o share do investidor).
 */
export function Waterfall({ steps }: { steps: WaterfallStep[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((s, i) => {
        const emphasised = s.kind === "subtotal" || s.kind === "result" || s.kind === "share";
        return (
          <li
            key={`${s.label}-${i}`}
            className={cn(
              "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-brand-line/60 py-3",
              emphasised && "border-brand-line",
              s.kind === "add" && "pl-4"
            )}
          >
            <div className="min-w-0">
              <span
                className={cn(
                  "text-sm",
                  emphasised
                    ? "font-semibold text-brand-white"
                    : "text-brand-soft"
                )}
              >
                {s.kind === "add" ? `+ ${s.label}` : s.label}
              </span>
              {s.hint ? (
                <p className="mt-0.5 text-[11px] text-brand-muted">{s.hint}</p>
              ) : null}
            </div>
            {s.kind === "result" || s.kind === "share" ? (
              <ResultValue cents={s.cents} size={s.kind === "result" ? "md" : "md"} />
            ) : (
              <span
                className={cn(
                  "tabular",
                  emphasised
                    ? "text-base font-semibold text-brand-white"
                    : "text-sm text-brand-white"
                )}
              >
                {money(s.cents)}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Encerramento obrigatório da cascata de veículo não vendido. */
export function WaterfallStopNotice() {
  return (
    <p className="mt-4 rounded-xl border border-brand-line bg-brand-raised px-4 py-3 text-xs leading-relaxed text-brand-soft">
      <span className="font-semibold text-brand-white">
        {RESULT_ON_SALE_ONLY}.
      </span>{" "}
      Enquanto o veículo está em estoque, não há lucro, margem ou valor a
      receber apurado. A cascata acima mostra apenas o capital aplicado e os
      custos já lançados.
    </p>
  );
}

/* ─────────────────────────────── Participação ──────────────────────────── */

export function SharePercent({ value }: { value: number }) {
  return <span className="tabular text-brand-white">{percent(value)}</span>;
}
