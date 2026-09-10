"use client";

import { useAsync, useInvestorId } from "@/lib/hooks";
import { getInvestorTickets } from "@/lib/data/tickets";
import { PageHeader } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
import { Card, CardBody, CardHeader } from "@/components/ui";
import { Faq } from "./faq";
import { TicketPanel } from "./ticket-panel";

export default function SupportPage() {
  const investorId = useInvestorId();
  const q = useAsync(
    async () => (investorId ? await getInvestorTickets(investorId) : null),
    [investorId]
  );

  if (q.status === "loading" || !q.data) return <PageSkeleton cards={2} />;

  return (
    <>
      <PageHeader
        title="Suporte"
        description="Dúvidas frequentes respondidas sem rodeio, e um canal direto para o que não estiver aqui."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Card>
            <CardHeader
              title="Dúvidas frequentes"
              subtitle="As respostas descrevem como a operação funciona hoje. Onde a regra depende do contrato, isso está dito de forma explícita."
            />
            <CardBody>
              <Faq />
            </CardBody>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <TicketPanel tickets={q.data} />
        </div>
      </div>
    </>
  );
}
