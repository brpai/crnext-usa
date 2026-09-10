"use client";

import Link from "next/link";
import { AlertTriangle, Info, ArrowRight } from "lucide-react";
import { useAsync, useInvestorId } from "@/lib/hooks";
import { getInvestorPortfolio } from "@/lib/data/portfolio";
import { isSold } from "@/lib/types";
import { money, vehicleLabel } from "@/lib/format";
import { RIGHT_LABEL } from "@/lib/copy";
import {
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  LinkButton,
  PastResultsNote,
  cn,
} from "@/components/ui";
import {
  AgingBadge,
  ResultPlaceholder,
  StatCard,
  VehicleStatusBadge,
} from "@/components/finance";
import { PageHeader } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
import { CapitalByVehicleChart, RealizedHistoryChart } from "@/components/charts";

export default function InvestorOverviewPage() {
  const investorId = useInvestorId();
  const q = useAsync(
    async () => (investorId ? await getInvestorPortfolio(investorId) : null),
    [investorId]
  );

  if (q.status === "loading") return <PageSkeleton cards={6} />;
  if (!q.data) {
    return (
      <EmptyState
        title="Posição não encontrada"
        description="Não localizamos a posição deste investidor. Fale com a CarNext pelo suporte."
      />
    );
  }

  const portfolio = q.data;
  const { investor, positions, alerts } = portfolio;
  const inStock = positions.filter((p) => !isSold(p.vehicle));

  return (
    <>
      <PageHeader
        title={`Olá, ${investor.name.split(" ")[0]}`}
        description={`Seu direito é de ${RIGHT_LABEL}. Os valores de resultado abaixo são de veículos já vendidos.`}
      />

      <section
        aria-label="Resumo da posição"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <StatCard
          label="Capital total aportado"
          value={money(investor.contributedCents)}
          hint="Soma de todos os aportes recebidos."
        />
        <StatCard
          label="Capital alocado em veículos"
          value={money(investor.allocatedCents)}
          hint="Aplicado em veículos que ainda não foram vendidos."
        />
        <StatCard
          label="Capital disponível"
          value={money(investor.availableCents)}
          hint="Aportado e ainda não alocado a nenhum veículo."
        />
        <StatCard
          label="Lucro realizado acumulado"
          value={money(investor.realizedProfitCents)}
          tone={investor.realizedProfitCents > 0 ? "gain" : "neutral"}
          hint="Distribuições já pagas, somente de veículos vendidos."
        />
        <StatCard
          label="Veículos em estoque"
          value={portfolio.inStockCount}
          hint="Com capital seu alocado. Resultado apurado somente na venda."
        />
        <StatCard
          label="Veículos vendidos"
          value={portfolio.soldCount}
          hint="Operações encerradas com resultado apurado."
        />
      </section>

      {alerts.length > 0 ? (
        <section aria-label="Avisos" className="mt-8 space-y-3">
          {alerts.map((a, i) => (
            <Link
              key={i}
              href={a.href ?? "#"}
              className={cn(
                "flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors",
                a.severity === "atencao"
                  ? "border-warn/30 bg-warn-dim hover:border-warn/50"
                  : "border-brand-line bg-brand-surface hover:bg-brand-raised"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 shrink-0",
                  a.severity === "atencao" ? "text-warn" : "text-brand-muted"
                )}
              >
                {a.severity === "atencao" ? (
                  <AlertTriangle size={17} />
                ) : (
                  <Info size={17} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-brand-white">
                  {a.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-brand-muted">
                  {a.detail}
                </span>
              </span>
              <ArrowRight size={16} className="mt-1 shrink-0 text-brand-muted" />
            </Link>
          ))}
        </section>
      ) : null}

      <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Histórico realizado"
            subtitle="Capital alocado e lucro distribuído, mês a mês. Apenas movimentos já ocorridos."
          />
          <CardBody>
            <RealizedHistoryChart data={portfolio.realizedHistory} />
            <PastResultsNote className="mt-4" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Distribuição do seu capital"
            subtitle="Em quais veículos em estoque o seu capital está alocado hoje."
          />
          <CardBody>
            <CapitalByVehicleChart data={portfolio.capitalByVehicle} />
          </CardBody>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardHeader
            title="Seus veículos em estoque"
            subtitle="Enquanto o veículo está em estoque, a tela mostra capital e custos. Não há resultado apurado."
            action={
              <LinkButton href="/veiculos" variant="secondary">
                Ver todos
              </LinkButton>
            }
          />
          <CardBody className="px-0 py-0">
            {inStock.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="Nenhum veículo em estoque no momento"
                  description="Quando houver capital seu alocado a um veículo, ele aparece aqui com o tempo de estoque e os custos lançados."
                />
              </div>
            ) : (
              <ul className="divide-y divide-brand-line/60">
                {inStock.map((p) => (
                  <li key={p.allocation.id}>
                    <Link
                      href={`/veiculos/${p.vehicle.id}`}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-brand-raised/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-brand-white">
                          {vehicleLabel(p.vehicle)}
                        </p>
                        <p className="mt-1 truncate font-mono text-[11px] text-brand-muted">
                          VIN {p.vehicle.vin}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <AgingBadge days={p.vehicle.daysInStock} />
                          <VehicleStatusBadge status={p.vehicle.status} />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-brand-muted">Seu capital</p>
                        <p className="tabular text-sm font-medium text-brand-white">
                          {money(p.allocation.amountCents)}
                        </p>
                        <div className="mt-1">
                          <ResultPlaceholder />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>
    </>
  );
}
