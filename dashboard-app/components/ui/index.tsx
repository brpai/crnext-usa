import * as React from "react";
import Link from "next/link";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ──────────────────────────────── Card ─────────────────────────────────── */

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-line bg-brand-surface shadow-[0_1px_2px_rgba(4,58,83,0.05)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-brand-line px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-wide text-brand-white">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-brand-muted">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

/* ──────────────────────────────── Badge ────────────────────────────────── */

type BadgeTone = "neutral" | "ok" | "atencao" | "critico" | "info";

const BADGE_TONE: Record<BadgeTone, string> = {
  neutral: "border-brand-line bg-brand-raised text-brand-soft",
  ok: "border-gain/25 bg-gain-dim text-gain",
  atencao: "border-warn/25 bg-warn-dim text-warn",
  critico: "border-loss/25 bg-loss-dim text-loss",
  info: "border-brand-line bg-brand-raised text-brand-white",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        BADGE_TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────── Botões ────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-white text-brand-black hover:bg-brand-deep disabled:bg-brand-line disabled:text-brand-muted",
  secondary:
    "border border-brand-line bg-brand-surface text-brand-white hover:border-brand-muted",
  ghost: "text-brand-soft hover:bg-brand-raised hover:text-brand-white",
  danger: "border border-loss/30 bg-loss-dim text-loss hover:border-loss/60",
};

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button className={cn(BUTTON_BASE, BUTTON_VARIANT[variant], className)} {...rest} />
  );
}

export function LinkButton({
  href,
  variant = "secondary",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(BUTTON_BASE, BUTTON_VARIANT[variant], className)}>
      {children}
    </Link>
  );
}

/* ─────────────────────────────── Formulário ────────────────────────────── */

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-brand-soft"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-brand-muted">{hint}</p> : null}
    </div>
  );
}

const CONTROL =
  "w-full rounded-xl border border-brand-line bg-brand-surface px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted focus:border-brand-muted";

export function Input({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, className)} {...rest} />;
}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, "min-h-[110px]", className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL, className)} {...rest}>
      {children}
    </select>
  );
}

/* ──────────────────────────────── Tabela ───────────────────────────────── */

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
  className,
  scope = "col",
}: {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  scope?: "col" | "row";
}) {
  return (
    <th
      scope={scope}
      className={cn(
        "border-b border-brand-line px-4 py-3 text-xs font-medium uppercase tracking-wide text-brand-muted",
        align === "right" && "text-right",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = "left",
  className,
  colSpan,
}: {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "border-b border-brand-line/60 px-4 py-3 align-middle text-brand-white",
        align === "right" && "text-right tabular",
        align === "center" && "text-center",
        className
      )}
    >
      {children}
    </td>
  );
}

/** Linha de totais no rodapé da tabela. */
export function TotalRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="bg-brand-raised/70 font-semibold text-brand-white">{children}</tr>
  );
}

/* ─────────────────────────────── Estado vazio ──────────────────────────── */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-line px-6 py-14 text-center">
      {icon ? <div className="text-brand-muted">{icon}</div> : null}
      <h3 className="text-sm font-semibold text-brand-white">{title}</h3>
      <p className="max-w-md text-xs leading-relaxed text-brand-muted">
        {description}
      </p>
      {action}
    </div>
  );
}

/* ─────────────────────────────── Skeletons ─────────────────────────────── */

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={cn("skeleton", className)} style={style} aria-hidden="true" />;
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Carregando gráfico">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="w-full" style={{ height }} />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/* ─────────────────────────── Notas de conformidade ─────────────────────── */

/** Nota discreta e permanente sob histórico agregado. */
export function PastResultsNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] leading-relaxed text-brand-muted",
        className
      )}
    >
      Resultados passados de veículos já vendidos. Não representam previsão nem
      garantia de resultado futuro.
    </p>
  );
}

/** Tarja de pendência contratual, visível no protótipo. */
export function PendingContractNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-warn/30 bg-warn/10 px-3 py-2 text-[11px] leading-relaxed text-warn">
      {children}
    </p>
  );
}
