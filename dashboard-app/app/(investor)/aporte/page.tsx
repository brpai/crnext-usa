"use client";

import { useAsync, useInvestorId } from "@/lib/hooks";
import { getRealizedTrackRecord } from "@/lib/data/portfolio";
import { getInvestorRequests } from "@/lib/data/requests";
import { getInvestor } from "@/lib/data/investors";
import { PageHeader } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PastResultsNote,
} from "@/components/ui";
import { ResultValue } from "@/components/finance";
import {
  METHOD_LABEL,
  REQUEST_STATUS_LABEL,
  dateTime,
  money,
  plural,
} from "@/lib/format";
import { PAST_RESULTS_NOTE } from "@/lib/copy";
import { RequestForm } from "./request-form";

export default function ContributionPage() {
  const investorId = useInvestorId();

  const q = useAsync(async () => {
    if (!investorId) return null;
    const [investor, record, requests] = await Promise.all([
      getInvestor(investorId),
      getRealizedTrackRecord(),
      getInvestorRequests(investorId),
    ]);
    return { investor, record, requests };
  }, [investorId]);

  if (q.status === "loading" || !q.data) return <PageSkeleton cards={4} />;
  const { investor, record, requests } = q.data;

  return (
    <>
      <PageHeader
        title="Solicitar aporte"
        description="Envie uma solicitação de novo aporte. Abaixo, o histórico realizado da operação — apenas fatos de veículos já vendidos e o que segue em estoque."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-3">
          <Card>
            <CardHeader
              title="Histórico realizado da operação"
              subtitle="Fatos apurados de veículos já vendidos. Todos os números abaixo são de operações encerradas."
            />
            <CardBody className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Metric
                  label="Veículos já vendidos"
                  value={String(record.soldCount)}
                />
                <Metric
                  label="Custo final médio dos vendidos"
                  value={money(record.avgLandedCostCents)}
                />
                <Metric
                  label="Lucro líquido médio dos vendidos"
                  value={<ResultValue cents={record.avgNetProfitCents} size="md" />}
                />
                <Metric
                  label="Tempo médio em estoque dos vendidos"
                  value={plural(record.avgDaysToSale, "dia", "dias")}
                />
              </div>
              <PastResultsNote />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="O que ainda não foi vendido"
              subtitle="A contrapartida do histórico acima: veículos que seguem em estoque."
            />
            <CardBody className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Metric
                  label="Veículos em estoque"
                  value={String(record.inStockCount)}
                />
                <Metric
                  label="Em estoque há mais de 60 dias"
                  value={String(record.inStockOver60dCount)}
                  tone={record.inStockOver60dCount > 0 ? "warn" : "neutral"}
                />
                <Metric
                  label="Vendas com prejuízo"
                  value={String(record.soldAtLossCount)}
                  tone={record.soldAtLossCount > 0 ? "loss" : "neutral"}
                />
              </div>
              <p className="text-[11px] leading-relaxed text-brand-muted">
                {PAST_RESULTS_NOTE} Veículos em estoque não têm resultado
                apurado e não geram pagamento enquanto não forem vendidos.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Suas solicitações" />
            <CardBody className="px-0 py-0">
              {requests.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    title="Nenhuma solicitação enviada"
                    description="Quando você enviar uma solicitação de aporte, ela aparece aqui com o status e a resposta da CarNext."
                  />
                </div>
              ) : (
                <ul className="divide-y divide-brand-line/60">
                  {requests.map((r) => (
                    <li key={r.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="tabular text-sm font-medium text-brand-white">
                            {money(r.amountCents)}{" "}
                            <span className="font-normal text-brand-muted">
                              via {METHOD_LABEL[r.method]}
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-brand-muted">
                            Enviada em {dateTime(r.createdAt)}
                          </p>
                          {r.message ? (
                            <p className="mt-2 max-w-lg text-xs leading-relaxed text-brand-soft">
                              “{r.message}”
                            </p>
                          ) : null}
                          {r.adminResponse ? (
                            <p className="mt-2 max-w-lg rounded-lg border border-brand-line bg-brand-raised px-3 py-2 text-xs leading-relaxed text-brand-soft">
                              {r.adminResponse}
                            </p>
                          ) : null}
                        </div>
                        <Badge
                          tone={
                            r.status === "aprovado"
                              ? "ok"
                              : r.status === "recusado"
                                ? "critico"
                                : "neutral"
                          }
                        >
                          {REQUEST_STATUS_LABEL[r.status]}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <RequestForm availableCents={investor?.availableCents ?? 0} />
        </div>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "neutral" | "warn" | "loss";
}) {
  return (
    <div className="rounded-xl border border-brand-line bg-brand-raised px-4 py-3.5">
      <p className="text-xs text-brand-muted">{label}</p>
      <p
        className={
          "mt-1.5 text-lg font-semibold tabular " +
          (tone === "warn"
            ? "text-warn"
            : tone === "loss"
              ? "text-loss"
              : "text-brand-white")
        }
      >
        {value}
      </p>
    </div>
  );
}
