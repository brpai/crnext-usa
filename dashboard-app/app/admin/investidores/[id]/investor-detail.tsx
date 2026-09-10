"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAsync } from "@/lib/hooks";
import { getInvestor } from "@/lib/data/investors";
import { getInvestorPositions } from "@/lib/data/portfolio";
import { getInvestorMovements } from "@/lib/data/movements";
import { getInvestorContracts } from "@/lib/data/contracts";
import { isSold } from "@/lib/types";
import { PageHeader } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
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
} from "@/components/ui";
import { ResultValue, StatCard } from "@/components/finance";
import {
  CONTRACT_STATUS_LABEL,
  MOVEMENT_LABEL,
  date,
  money,
  vehicleLabel,
} from "@/lib/format";
import { BalanceChart, ViewToggle, type ViewMode } from "@/components/charts";

export function InvestorDetail({ id }: { id: string }) {
  const [statementView, setStatementView] = useState<ViewMode>("tabela");
  const q = useAsync(async () => {
    const [investor, positions, movements, contracts] = await Promise.all([
      getInvestor(id),
      getInvestorPositions(id),
      getInvestorMovements(id),
      getInvestorContracts(id),
    ]);
    return { investor, positions, movements, contracts };
  }, [id]);

  if (q.status === "loading") return <PageSkeleton cards={4} />;
  const { investor, positions, movements, contracts } = q.data;

  if (!investor) {
    return (
      <EmptyState
        title="Investidor não encontrado"
        description="Este investidor não existe na base de demonstração."
      />
    );
  }

  return (
    <>
      <Link
        href="/admin/investidores"
        className="mb-5 inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-white"
      >
        <ArrowLeft size={16} /> Voltar
      </Link>

      <PageHeader
        title={investor.name}
        description={`${investor.email} · ${investor.phone} · na base desde ${date(investor.joinedAt)}`}
        action={
          <div className="flex flex-wrap gap-2">
            {/* TODO(supabase): server actions de insert em capital_movements. */}
            <Button variant="secondary">Registrar aporte</Button>
            <Button variant="secondary">Registrar distribuição</Button>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Aportado" value={money(investor.contributedCents)} />
        <StatCard label="Alocado" value={money(investor.allocatedCents)} />
        <StatCard label="Disponível" value={money(investor.availableCents)} />
        <StatCard
          label="Lucro pago"
          value={money(investor.realizedProfitCents)}
          tone="gain"
        />
      </section>

      <section className="mt-8 space-y-5">
        <Card>
          <CardHeader title="Alocações" subtitle={`${positions.length} veículos.`} />
          <CardBody className="px-0 py-0">
            {positions.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="Sem alocações"
                  description="Este investidor ainda não tem capital alocado a nenhum veículo."
                />
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Veículo</Th>
                    <Th>Status</Th>
                    <Th align="right">Capital</Th>
                    <Th align="right">Participação</Th>
                    <Th align="right">Share pago</Th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p) => (
                    <tr key={p.allocation.id}>
                      <Td>
                        <span className="text-brand-white">
                          {vehicleLabel(p.vehicle)}
                        </span>
                        <p className="mt-0.5 font-mono text-[11px] text-brand-muted">
                          {p.vehicle.vin}
                        </p>
                      </Td>
                      <Td>
                        <Badge tone={isSold(p.vehicle) ? "ok" : "neutral"}>
                          {isSold(p.vehicle) ? "Vendido" : "Em estoque"}
                        </Badge>
                      </Td>
                      <Td align="right">{money(p.allocation.amountCents)}</Td>
                      <Td align="right">
                        {p.allocation.sharePercent.toFixed(1).replace(".", ",")}%
                      </Td>
                      <Td align="right">
                        {p.realizedShareCents === null ? (
                          <span className="text-xs text-brand-muted">
                            Apurado na venda
                          </span>
                        ) : (
                          <ResultValue
                            cents={p.realizedShareCents}
                            size="sm"
                            showSign={false}
                          />
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Extrato"
            subtitle={`${movements.length} movimentos.`}
            action={
              movements.length > 0 ? (
                <ViewToggle value={statementView} onChange={setStatementView} />
              ) : undefined
            }
          />
          <CardBody className="px-0 py-0">
            {statementView === "grafico" && movements.length > 0 ? (
              <div className="p-5">
                <BalanceChart rows={movements} />
              </div>
            ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Data</Th>
                  <Th>Movimento</Th>
                  <Th>Referência</Th>
                  <Th align="right">Valor</Th>
                  <Th align="right">Saldo</Th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <Td>
                      <span className="tabular text-xs text-brand-soft">
                        {date(m.date)}
                      </span>
                    </Td>
                    <Td>{MOVEMENT_LABEL[m.type]}</Td>
                    <Td>
                      <span className="font-mono text-[11px] text-brand-muted">
                        {m.bankReference}
                      </span>
                    </Td>
                    <Td align="right">{money(m.amountCents)}</Td>
                    <Td align="right">{money(m.balanceCents)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Contratos" />
          <CardBody className="px-0 py-0">
            {contracts.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="Sem contrato vinculado"
                  description="Vincule um contrato a este investidor na tela de contratos."
                />
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Contrato</Th>
                    <Th>Assinatura</Th>
                    <Th>Vigência</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => (
                    <tr key={c.id}>
                      <Td>{c.title}</Td>
                      <Td>
                        <span className="tabular text-xs text-brand-soft">
                          {date(c.signedAt)}
                        </span>
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
            )}
          </CardBody>
        </Card>
      </section>
    </>
  );
}
