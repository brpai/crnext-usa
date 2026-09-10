"use client";

import * as React from "react";
import { CalendarClock } from "lucide-react";
import type { LedgerEntry } from "@/lib/types";
import {
  FinanceError,
  accountName,
  categoryLabel,
  isOverdue,
  listLedgerEntries,
  markLedgerEntryPaid,
  todayIso,
  type FinanceActor,
} from "@/lib/data/finance";
import { useSession } from "@/lib/hooks";
import { StatCard } from "@/components/finance";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Table,
  Td,
  Th,
  TotalRow,
} from "@/components/ui";
import { LEDGER_METHOD_LABEL, date, money, plural } from "@/lib/format";
import { SMALL, daysUntil } from "../finance-ui";

const sum = (list: LedgerEntry[]) => list.reduce((n, e) => n + e.amountCents, 0);

export function Payables({ initialEntries }: { initialEntries: LedgerEntry[] }) {
  const session = useSession();
  const actor: FinanceActor = { name: session?.displayName ?? "Admin" };
  const today = todayIso();

  const [entries, setEntries] = React.useState(initialEntries);
  const [rowError, setRowError] = React.useState<{ id: string; text: string } | null>(null);

  const pending = entries
    .filter((e) => e.status === "pendente")
    .sort((a, b) => ((a.dueDate ?? a.date) < (b.dueDate ?? b.date) ? -1 : 1));
  const toPay = pending.filter((e) => e.direction === "saida");
  const toReceive = pending.filter((e) => e.direction === "entrada");
  const overduePay = toPay.filter((e) => isOverdue(e, today));
  const overdueReceive = toReceive.filter((e) => isOverdue(e, today));

  async function settle(id: string) {
    setRowError(null);
    try {
      await markLedgerEntryPaid(id, actor);
      setEntries(await listLedgerEntries());
    } catch (err) {
      setRowError({ id, text: err instanceof FinanceError ? err.message : "Não foi possível dar baixa." });
    }
  }

  return (
    <>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="A pagar" value={money(sum(toPay))} hint={plural(toPay.length, "conta em aberto", "contas em aberto")} />
        <StatCard label="A receber" value={money(sum(toReceive))} hint={plural(toReceive.length, "conta em aberto", "contas em aberto")} />
        <StatCard label="Atrasado a pagar" value={money(sum(overduePay))} hint={plural(overduePay.length, "conta vencida", "contas vencidas")} />
        <StatCard label="Atrasado a receber" value={money(sum(overdueReceive))} hint={plural(overdueReceive.length, "conta vencida", "contas vencidas")} />
      </section>

      <div className="mt-8 space-y-5">
        <PendingTable
          title="A pagar"
          subtitle="Saídas pendentes da empresa."
          rows={toPay}
          today={today}
          actionLabel="Pagar"
          onSettle={settle}
          rowError={rowError}
        />
        <PendingTable
          title="A receber"
          subtitle="Entradas pendentes da empresa."
          rows={toReceive}
          today={today}
          actionLabel="Receber"
          onSettle={settle}
          rowError={rowError}
        />
      </div>
    </>
  );
}

function DueBadge({ due, today }: { due: string; today: string }) {
  const days = daysUntil(due, today);
  if (days < 0) return <Badge tone="critico">Atrasada há {plural(-days, "dia", "dias")}</Badge>;
  if (days === 0) return <Badge tone="atencao">Vence hoje</Badge>;
  if (days <= 7) return <Badge tone="atencao">Vence em {plural(days, "dia", "dias")}</Badge>;
  return <Badge tone="neutral">Vence em {plural(days, "dia", "dias")}</Badge>;
}

function PendingTable({
  title,
  subtitle,
  rows,
  today,
  actionLabel,
  onSettle,
  rowError,
}: {
  title: string;
  subtitle: string;
  rows: LedgerEntry[];
  today: string;
  actionLabel: string;
  onSettle: (id: string) => void;
  rowError: { id: string; text: string } | null;
}) {
  return (
    <Card>
      <CardHeader title={title} subtitle={`${subtitle} ${plural(rows.length, "conta", "contas")}.`} />
      <CardBody className="px-0 py-0">
        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<CalendarClock size={26} />}
              title="Nada pendente"
              description="Quando houver uma conta em aberto, ela aparece aqui com o vencimento."
            />
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Vencimento</Th>
                <Th>Conta</Th>
                <Th>Contraparte</Th>
                <Th>Pagamento</Th>
                <Th align="right">Valor</Th>
                <Th align="right">Ação</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <Td>
                    <span className="tabular whitespace-nowrap text-xs text-brand-soft">
                      {e.dueDate ? date(e.dueDate) : "—"}
                    </span>
                    {e.dueDate ? (
                      <div className="mt-1">
                        <DueBadge due={e.dueDate} today={today} />
                      </div>
                    ) : null}
                  </Td>
                  <Td>
                    <span className="text-brand-white">{e.description}</span>
                    {categoryLabel(e.category) !== e.description ? (
                      <p className="mt-0.5 text-[11px] text-brand-muted">{categoryLabel(e.category)}</p>
                    ) : null}
                  </Td>
                  <Td>
                    <span className="text-xs text-brand-soft">{e.counterparty}</span>
                  </Td>
                  <Td>
                    <span className="text-xs text-brand-soft">{accountName(e.accountId)}</span>
                    <p className="text-[11px] text-brand-muted">{LEDGER_METHOD_LABEL[e.method]}</p>
                  </Td>
                  <Td align="right">{money(e.amountCents)}</Td>
                  <Td align="right">
                    <Button variant="secondary" className={SMALL} onClick={() => onSettle(e.id)}>
                      {actionLabel}
                    </Button>
                    {rowError?.id === e.id ? (
                      <p role="alert" className="mt-1.5 text-[11px] text-loss">
                        {rowError.text}
                      </p>
                    ) : null}
                  </Td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <TotalRow>
                <Td className="border-b-0" colSpan={4}>
                  Total
                </Td>
                <Td align="right" className="border-b-0">
                  {money(sum(rows))}
                </Td>
                <Td className="border-b-0" />
              </TotalRow>
            </tfoot>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
