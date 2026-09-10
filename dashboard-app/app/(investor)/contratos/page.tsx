"use client";

import { FileText, ShieldCheck } from "lucide-react";
import { useAsync, useInvestorId } from "@/lib/hooks";
import { getInvestorContracts } from "@/lib/data/contracts";
import { PageHeader } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  PendingContractNote,
} from "@/components/ui";
import { CONTRACT_STATUS_LABEL, date } from "@/lib/format";
import { TODO_CONTRACT } from "@/lib/copy";

export default function ContractsPage() {
  const investorId = useInvestorId();
  const q = useAsync(
    async () => (investorId ? await getInvestorContracts(investorId) : null),
    [investorId]
  );

  if (q.status === "loading" || !q.data) return <PageSkeleton cards={2} />;
  const contracts = q.data;

  return (
    <>
      <PageHeader
        title="Contratos"
        description="Os acordos que você assinou, com um resumo em linguagem simples acima do documento formal."
      />

      {contracts.length === 0 ? (
        <EmptyState
          icon={<FileText size={26} />}
          title="Nenhum contrato registrado"
          description="Assim que um acordo for assinado, ele aparece aqui com resumo dos termos e o documento completo."
        />
      ) : (
        <div className="space-y-6">
          {contracts.map((c) => {
            const pending = c.summaryBullets.filter((b) =>
              b.startsWith("TODO: CONFIRMAR")
            );
            const settled = c.summaryBullets.filter(
              (b) => !b.startsWith("TODO: CONFIRMAR")
            );

            return (
              <Card key={c.id}>
                <CardHeader
                  title={c.title}
                  subtitle={`Assinado em ${date(c.signedAt)} · Vigência de ${date(
                    c.validFrom
                  )} a ${date(c.validUntil)}`}
                  action={
                    <Badge tone={c.status === "vigente" ? "ok" : "neutral"}>
                      {CONTRACT_STATUS_LABEL[c.status]}
                    </Badge>
                  }
                />
                <CardBody className="space-y-6">
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-white">
                      <ShieldCheck size={16} className="text-brand-muted" />
                      Resumo dos termos
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {settled.map((b, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 text-sm leading-relaxed text-brand-soft"
                        >
                          <span
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-muted"
                            aria-hidden="true"
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    {pending.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {pending.map((b, i) => (
                          <PendingContractNote key={i}>{b}</PendingContractNote>
                        ))}
                      </div>
                    ) : null}
                    <p className="mt-4 text-[11px] leading-relaxed text-brand-muted">
                      Este resumo é uma leitura simplificada. Em caso de
                      divergência, prevalece o texto do documento abaixo.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-brand-white">
                      Documento
                    </h3>
                    <div className="mt-3 overflow-hidden rounded-xl border border-brand-line bg-brand-raised">
                      {/* TODO(supabase): URL assinada do Storage no lugar do arquivo fictício. */}
                      <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-8 text-center">
                        <FileText size={28} className="text-brand-muted" />
                        <p className="text-sm text-brand-soft">
                          Visualizador de PDF
                        </p>
                        <p className="max-w-sm text-xs leading-relaxed text-brand-muted">
                          Nesta demonstração o documento é fictício. Com o
                          backend conectado, o PDF assinado é carregado aqui a
                          partir do armazenamento privado.
                        </p>
                      </div>
                    </div>
                  </section>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-[11px] leading-relaxed text-brand-muted">
        {TODO_CONTRACT}
      </p>
    </>
  );
}
