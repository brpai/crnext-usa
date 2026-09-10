"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { listTickets } from "@/lib/data/tickets";
import { listInvestors } from "@/lib/data/investors";
import { PageHeader } from "@/components/shell";
import { TicketQueue } from "./ticket-queue";

export default function AdminSupportPage() {
  const q = useAsync(
    async () =>
      Promise.all([listTickets(), listInvestors()]).then(([t, i]) => ({
        tickets: t,
        investors: i,
      })),
    []
  );
  if (q.status === "loading") return <PageSkeleton cards={2} />;
  const { tickets, investors } = q.data;

  const names: Record<string, string> = {};
  for (const i of investors) names[i.id] = i.name;

  const open = tickets.filter((t) => t.status !== "resolvido").length;

  return (
    <>
      <PageHeader
        title="Suporte"
        description={`${open} tickets em aberto de ${tickets.length} no total.`}
      />
      <TicketQueue tickets={tickets} investorNames={names} />
    </>
  );
}
