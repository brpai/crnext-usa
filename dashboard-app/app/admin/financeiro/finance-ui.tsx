"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LedgerEntry } from "@/lib/types";
import { Badge, cn } from "@/components/ui";

const TABS = [
  { href: "/admin/financeiro", label: "Visão geral" },
  { href: "/admin/financeiro/lancamentos", label: "Lançamentos" },
  { href: "/admin/financeiro/contas", label: "Contas a pagar e receber" },
];

export function FinanceNav() {
  const pathname = (usePathname() ?? "").replace(/\/$/, "");
  return (
    <nav
      aria-label="Seções do financeiro"
      className="mb-6 flex flex-wrap gap-1 border-b border-brand-line"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-3 py-2.5 text-sm transition-colors",
              active
                ? "border-brand-white font-medium text-brand-white"
                : "border-transparent text-brand-muted hover:text-brand-white"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export const SMALL = "px-3 py-1.5 text-xs";

export function EntryStatusBadge({
  entry,
  overdue,
}: {
  entry: LedgerEntry;
  overdue: boolean;
}) {
  if (entry.status === "cancelado") return <Badge tone="neutral">Cancelado</Badge>;
  if (entry.status === "pago") {
    return <Badge tone="ok">{entry.direction === "entrada" ? "Recebido" : "Pago"}</Badge>;
  }
  if (overdue) return <Badge tone="critico">Atrasado</Badge>;
  return (
    <Badge tone="atencao">{entry.direction === "entrada" ? "A receber" : "A pagar"}</Badge>
  );
}

/** Dias entre hoje e o vencimento (negativo = atrasado). */
export function daysUntil(due: string, today: string): number {
  return Math.round((Date.parse(`${due}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}
