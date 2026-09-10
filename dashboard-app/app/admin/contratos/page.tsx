"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { Upload } from "lucide-react";
import { listContracts } from "@/lib/data/contracts";
import { listInvestors } from "@/lib/data/investors";
import { PageHeader } from "@/components/shell";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  Select,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { CONTRACT_STATUS_LABEL, date } from "@/lib/format";
import { TODO_CONTRACT } from "@/lib/copy";

export default function AdminContractsPage() {
  const q = useAsync(
    async () =>
      Promise.all([listContracts(), listInvestors()]).then(([c, i]) => ({
        contracts: c,
        investors: i,
      })),
    []
  );
  if (q.status === "loading") return <PageSkeleton cards={2} />;
  const { contracts, investors } = q.data;

  const names: Record<string, string> = {};
  for (const i of investors) names[i.id] = i.name;

  return (
    <>
      <PageHeader
        title="Contratos"
        description="Upload e vínculo de contrato a investidor, com vigência e status."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader title="Vincular contrato" />
            <CardBody>
              {/* TODO(supabase): insert em contracts + upload no bucket privado. */}
              <form className="space-y-4">
                <Field label="Investidor" htmlFor="c-investidor">
                  <Select id="c-investidor">
                    {investors.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Título" htmlFor="c-titulo">
                  <Input
                    id="c-titulo"
                    placeholder="Acordo de Participação por Veículo"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Início da vigência" htmlFor="c-de">
                    <Input id="c-de" type="date" />
                  </Field>
                  <Field label="Fim da vigência" htmlFor="c-ate">
                    <Input id="c-ate" type="date" />
                  </Field>
                </div>
                <Field
                  label="Arquivo PDF"
                  htmlFor="c-arquivo"
                  hint="Upload simulado no protótipo."
                >
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-brand-line px-3.5 py-3 text-xs text-brand-muted">
                    <Upload size={15} /> Selecionar PDF
                  </div>
                </Field>
                <Button type="button" className="w-full">
                  Vincular contrato
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="xl:col-span-3">
          <Card>
            <CardHeader
              title="Contratos registrados"
              subtitle={`${contracts.length} documentos.`}
            />
            <CardBody className="px-0 py-0">
              <Table>
                <thead>
                  <tr>
                    <Th>Investidor</Th>
                    <Th>Contrato</Th>
                    <Th>Vigência</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => (
                    <tr key={c.id}>
                      <Td>{names[c.investorId] ?? c.investorId}</Td>
                      <Td>
                        <span className="text-brand-soft">{c.title}</span>
                        <p className="mt-0.5 font-mono text-[11px] text-brand-muted">
                          {c.pdfUrl}
                        </p>
                      </Td>
                      <Td>
                        <span className="tabular text-xs text-brand-soft">
                          {date(c.validFrom)} — {date(c.validUntil)}
                        </span>
                      </Td>
                      <Td>
                        <Badge tone={c.status === "vigente" ? "ok" : "neutral"}>
                          {CONTRACT_STATUS_LABEL[c.status]}
                        </Badge>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>

          <p className="mt-4 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-[11px] leading-relaxed text-warn">
            {TODO_CONTRACT} Os resumos exibidos ao investidor trazem essa mesma
            tarja nos pontos ainda em aberto.
          </p>
        </div>
      </div>
    </>
  );
}
