"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { useAsync, useInvestorId } from "@/lib/hooks";
import { getVehicle, getVehicleCosts } from "@/lib/data/vehicles";
import { getInvestorPositions } from "@/lib/data/portfolio";
import { isSold } from "@/lib/types";
import type { WaterfallStep } from "@/components/finance";
import {
  AgingBadge,
  SharePercent,
  VehicleStatusBadge,
  Waterfall,
  WaterfallStopNotice,
} from "@/components/finance";
import {
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Table,
  Td,
  Th,
  TotalRow,
  PastResultsNote,
} from "@/components/ui";
import { PageSkeleton } from "@/components/loading";
import { COST_CATEGORY_LABEL, date, miles, money, vehicleLabel } from "@/lib/format";
import { RIGHT_LABEL } from "@/lib/copy";
import { CostByCategoryChart, ViewToggle, type ViewMode } from "@/components/charts";
import { Gallery } from "./gallery";

export function VehicleDetail({ id }: { id: string }) {
  const investorId = useInvestorId();
  const [costView, setCostView] = useState<ViewMode>("tabela");

  const q = useAsync(async () => {
    if (!investorId) return null;
    const [vehicle, costs, positions] = await Promise.all([
      getVehicle(id),
      getVehicleCosts(id),
      getInvestorPositions(investorId),
    ]);
    const position = positions.find((p) => p.vehicle.id === id) ?? null;
    return { vehicle, costs, position };
  }, [id, investorId]);

  if (q.status === "loading" || !q.data) return <PageSkeleton cards={2} />;

  const { vehicle, costs, position } = q.data;

  // Investidor sem capital neste veículo não enxerga a ficha.
  if (!vehicle || !position) {
    return (
      <EmptyState
        title="Veículo não disponível"
        description="Este veículo não faz parte da sua posição. Só aparecem aqui os veículos em que você tem capital alocado."
        action={
          <Link
            href="/veiculos"
            className="text-sm text-brand-soft underline decoration-brand-line underline-offset-4 hover:text-brand-white"
          >
            Voltar para veículos
          </Link>
        }
      />
    );
  }

  const sold = isSold(vehicle);
  const label = vehicleLabel(vehicle);

  /* A cascata: em estoque PARA no custo final; vendida segue até o share. */
  const steps: WaterfallStep[] = [
    {
      label: "Custo de aquisição",
      cents: vehicle.acquisitionCostCents,
      kind: "base",
    },
    {
      label: "Custos variáveis lançados",
      cents: vehicle.variableCostsCents,
      kind: "add",
      hint: `${costs.length} ${costs.length === 1 ? "lançamento" : "lançamentos"} detalhados abaixo`,
    },
    {
      label: sold ? "Custo final do veículo" : "Custo final acumulado até hoje",
      cents: vehicle.landedCostCents,
      kind: "subtotal",
    },
  ];

  if (isSold(vehicle)) {
    steps.push(
      {
        label: "Preço de venda realizado",
        cents: vehicle.salePriceCents,
        kind: "sale",
        hint: `Vendido em ${date(vehicle.saleDate)}`,
      },
      {
        label:
          vehicle.netProfitCents >= 0
            ? "Lucro líquido realizado"
            : "Prejuízo realizado",
        cents: vehicle.netProfitCents,
        kind: "result",
      },
      {
        label: "Seu share do resultado",
        cents: position.realizedShareCents ?? 0,
        kind: "share",
        hint:
          vehicle.netProfitCents > 0
            ? `30% do lucro líquido, pro-rata da sua participação de ${position.allocation.sharePercent
                .toFixed(1)
                .replace(".", ",")}%`
            : "Venda sem lucro líquido — não há valor a distribuir.",
      }
    );
  } else {
    steps.push({
      label: "Preço pedido",
      cents: vehicle.askingPriceCents,
      kind: "base",
      hint: "Valor anunciado. Não é previsão de venda.",
    });
  }

  return (
    <>
      <Link
        href="/veiculos"
        className="mb-5 inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-white"
      >
        <ArrowLeft size={16} /> Voltar para veículos
      </Link>

      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-white">
          {label}
        </h1>
        <p className="mt-2 font-mono text-xs text-brand-muted">VIN {vehicle.vin}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <AgingBadge days={vehicle.daysInStock} />
          <VehicleStatusBadge status={vehicle.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Gallery photos={vehicle.photos} label={label} />

          <Card>
            <CardHeader title="Ficha do veículo" />
            <CardBody>
              <dl className="space-y-3 text-sm">
                <Row label="Ano / marca / modelo" value={label} />
                <Row label="Versão" value={vehicle.trim} />
                <Row label="Milhagem" value={miles(vehicle.mileage)} />
                <Row label="Cor" value={vehicle.color} />
                <Row label="Data de compra" value={date(vehicle.purchaseDate)} />
                <Row label="VIN" value={vehicle.vin} mono />
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Sua participação"
              subtitle={`Direito de ${RIGHT_LABEL}.`}
            />
            <CardBody>
              <dl className="space-y-3 text-sm">
                <Row
                  label="Capital que você alocou"
                  value={money(position.allocation.amountCents)}
                />
                <Row
                  label="Sua participação no capital do veículo"
                  value={<SharePercent value={position.allocation.sharePercent} />}
                />
                <Row
                  label="Data da alocação"
                  value={date(position.allocation.date)}
                />
                <Row
                  label="Investidores neste veículo"
                  value={`${position.coInvestorCount}`}
                />
                {position.otherSharePercents.length > 0 ? (
                  <Row
                    label="Participação dos demais"
                    value={position.otherSharePercents
                      .map((p) => `${p.toFixed(1).replace(".", ",")}%`)
                      .join(" · ")}
                  />
                ) : null}
                {sold && position.paidAt ? (
                  <Row label="Data do pagamento" value={date(position.paidAt)} />
                ) : null}
              </dl>
              {position.otherSharePercents.length > 0 ? (
                <p className="mt-4 text-[11px] leading-relaxed text-brand-muted">
                  Por privacidade, os demais investidores deste veículo aparecem
                  apenas pelo percentual de participação.
                </p>
              ) : null}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5 xl:col-span-3">
          <Card>
            <CardHeader
              title={sold ? "Resultado realizado" : "Capital e custos"}
              subtitle={
                sold
                  ? "Cascata completa, do custo de aquisição ao seu share do resultado."
                  : "Cascata do capital aplicado. Não há resultado apurado enquanto o veículo está em estoque."
              }
            />
            <CardBody>
              <Waterfall steps={steps} />
              {sold ? <PastResultsNote className="mt-4" /> : <WaterfallStopNotice />}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Custos variáveis lançados"
              subtitle="Todo custo aplicado a este VIN, com data, fornecedor e comprovante."
              action={
                costs.length > 0 ? (
                  <ViewToggle value={costView} onChange={setCostView} />
                ) : undefined
              }
            />
            <CardBody className="px-0 py-0">
              {costView === "grafico" && costs.length > 0 ? (
                <div className="p-5">
                  <CostByCategoryChart costs={costs} />
                </div>
              ) : costs.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    title="Nenhum custo lançado ainda"
                    description="Assim que houver serviços ou taxas aplicados a este veículo, cada lançamento aparece aqui com o comprovante."
                  />
                </div>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th>Categoria</Th>
                      <Th>Descrição</Th>
                      <Th>Data</Th>
                      <Th>Fornecedor</Th>
                      <Th align="right">Valor</Th>
                      <Th align="right">Comprovante</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {costs.map((c) => (
                      <tr key={c.id}>
                        <Td>
                          <span className="text-brand-soft">
                            {COST_CATEGORY_LABEL[c.category]}
                          </span>
                        </Td>
                        <Td>{c.description}</Td>
                        <Td>
                          <span className="tabular text-brand-soft">
                            {date(c.date)}
                          </span>
                        </Td>
                        <Td>
                          <span className="text-brand-soft">{c.supplier}</span>
                        </Td>
                        <Td align="right">{money(c.amountCents)}</Td>
                        <Td align="right">
                          {c.receiptUrl ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-brand-soft">
                              <FileText size={13} /> Ver
                            </span>
                          ) : (
                            <span className="text-xs text-brand-muted">—</span>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <TotalRow>
                      <Td className="border-b-0">Total de custos variáveis</Td>
                      <Td className="border-b-0" />
                      <Td className="border-b-0" />
                      <Td className="border-b-0" />
                      <Td align="right" className="border-b-0">
                        {money(vehicle.variableCostsCents)}
                      </Td>
                      <Td className="border-b-0" />
                    </TotalRow>
                  </tfoot>
                </Table>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Linha do tempo"
              subtitle={
                sold
                  ? "Da compra à venda."
                  : "Etapas já concluídas. Não há data prevista de venda."
              }
            />
            <CardBody>
              <ol className="space-y-4">
                {vehicle.timeline.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-brand-muted">
                      <CheckCircle2 size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-brand-white">{e.label}</p>
                      <p className="mt-0.5 text-xs text-brand-muted">
                        <span className="tabular">{date(e.date)}</span>
                        {e.note ? ` · ${e.note}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-brand-line pt-4">
                <span className="text-sm text-brand-soft">
                  {sold ? "Dias em estoque até a venda" : "Dias em estoque"}
                </span>
                <span className="tabular text-lg font-semibold text-brand-white">
                  {vehicle.daysInStock}
                </span>
              </div>
              {!sold ? (
                <p className="mt-2 text-[11px] leading-relaxed text-brand-muted">
                  Contador informativo do tempo de estoque. Não indica meta nem
                  data de venda.
                </p>
              ) : null}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <dt className="text-brand-muted">{label}</dt>
      <dd
        className={
          mono
            ? "font-mono text-xs text-brand-white"
            : "tabular text-right text-brand-white"
        }
      >
        {value}
      </dd>
    </div>
  );
}
