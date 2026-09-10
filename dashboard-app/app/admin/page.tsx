"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { Suspense } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { getAdminOverview } from "@/lib/data/admin";
import { PageHeader } from "@/components/shell";
import {
  Card,
  CardBody,
  CardHeader,
  ChartSkeleton,
  Table,
  Td,
  Th,
  TotalRow,
  cn,
} from "@/components/ui";
import { ResultValue, StatCard } from "@/components/finance";
import { AgingChart } from "@/components/charts";
import { money, monthLabel, plural } from "@/lib/format";

export default function AdminOverviewPage() {
  const q = useAsync(() => getAdminOverview(), []);
  if (q.status === "loading") return <PageSkeleton cards={4} />;
  const data = q.data;
  const { reconciliation: rec, stock, monthSales, pnl } = data;

  const totalContributed = data.positions.reduce((n, p) => n + p.contributedCents, 0);
  const totalAllocated = data.positions.reduce((n, p) => n + p.allocatedCents, 0);
  const totalAvailable = data.positions.reduce((n, p) => n + p.availableCents, 0);
  const totalPaid = data.positions.reduce((n, p) => n + p.paidProfitCents, 0);

  return (
    <>
      <PageHeader
        title="Operação"
        description="Visão consolidada do capital sob gestão, do estoque e do resultado. Dados fictícios de demonstração."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Capital sob gestão"
          value={money(data.capitalUnderManagementCents)}
          hint="Alocado em veículos + disponível em custódia."
        />
        <StatCard
          label="Alocado em veículos"
          value={money(totalAllocated)}
          hint={`${plural(stock.vehicleCount, "veículo", "veículos")} em estoque.`}
        />
        <StatCard
          label="Disponível em custódia"
          value={money(totalAvailable)}
          hint="Aportado e ainda não alocado a nenhum VIN."
        />
        <StatCard
          label="Lucro já distribuído"
          value={money(totalPaid)}
          tone="gain"
          hint="Somente de veículos vendidos."
        />
      </section>

      {/* Conciliação */}
      <section className="mt-8">
        <Card>
          <CardHeader
            title="Conciliação de caixa"
            subtitle="Caixa da empresa contra a soma das posições disponíveis dos investidores. A conta bancária é única; esta tela separa o que é de quem."
          />
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Line label="Caixa da empresa" cents={rec.companyCashCents} />
              <Line
                label="Soma das posições disponíveis"
                cents={rec.investorPositionsCents}
              />
              <div
                className={cn(
                  "rounded-xl border px-4 py-3.5",
                  rec.matches
                    ? "border-gain/30 bg-gain/5"
                    : "border-loss/30 bg-loss/5"
                )}
              >
                <p className="flex items-center gap-2 text-xs text-brand-muted">
                  {rec.matches ? (
                    <CheckCircle2 size={14} className="text-gain" />
                  ) : (
                    <AlertTriangle size={14} className="text-loss" />
                  )}
                  {rec.matches ? "Caixa cobre as posições" : "Caixa não cobre as posições"}
                </p>
                <p className="mt-1.5">
                  <ResultValue cents={rec.differenceCents} size="md" />
                </p>
                <p className="mt-1 text-[11px] text-brand-muted">
                  Diferença entre o caixa e o que é dos investidores.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Capital fracionado por investidor */}
      <section className="mt-8">
        <Card>
          <CardHeader
            title="Capital fracionado por investidor"
            subtitle="Quanto cada investidor aportou, quanto está alocado, quanto está livre e quanto já recebeu."
          />
          <CardBody className="px-0 py-0">
            <Table>
              <thead>
                <tr>
                  <Th>Investidor</Th>
                  <Th align="right">Aportado</Th>
                  <Th align="right">Alocado</Th>
                  <Th align="right">Disponível</Th>
                  <Th align="right">Lucro pago</Th>
                </tr>
              </thead>
              <tbody>
                {data.positions.map((p) => (
                  <tr key={p.investor.id}>
                    <Td>
                      <span className="text-brand-white">{p.investor.name}</span>
                      <p className="mt-0.5 text-[11px] text-brand-muted">
                        {p.investor.status === "ativo" ? "Ativo" : "Inativo"}
                      </p>
                    </Td>
                    <Td align="right">{money(p.contributedCents)}</Td>
                    <Td align="right">{money(p.allocatedCents)}</Td>
                    <Td align="right">{money(p.availableCents)}</Td>
                    <Td align="right">
                      <span className={p.paidProfitCents > 0 ? "text-gain" : ""}>
                        {money(p.paidProfitCents)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <TotalRow>
                  <Td className="border-b-0">Total</Td>
                  <Td align="right" className="border-b-0">
                    {money(totalContributed)}
                  </Td>
                  <Td align="right" className="border-b-0">
                    {money(totalAllocated)}
                  </Td>
                  <Td align="right" className="border-b-0">
                    {money(totalAvailable)}
                  </Td>
                  <Td align="right" className="border-b-0">
                    {money(totalPaid)}
                  </Td>
                </TotalRow>
              </tfoot>
            </Table>
          </CardBody>
        </Card>
      </section>

      {/* Estoque + vendas */}
      <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Estoque"
            subtitle={`${plural(stock.vehicleCount, "veículo", "veículos")} · aging médio de ${plural(stock.avgAgingDays, "dia", "dias")}.`}
          />
          <CardBody className="space-y-4">
            <Line label="Valor imobilizado" cents={stock.immobilizedCents} />
            <Suspense fallback={<ChartSkeleton height={200} />}>
              <AgingChart data={stock.agingBuckets} />
            </Suspense>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={`Vendas — ${monthLabel(monthSales.month)}`}
            subtitle="Último mês com venda fechada na base de demonstração."
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-brand-line bg-brand-raised px-4 py-3.5">
                <p className="text-xs text-brand-muted">Veículos vendidos</p>
                <p className="mt-1.5 text-lg font-semibold tabular text-brand-white">
                  {monthSales.soldCount}
                </p>
              </div>
              <div className="rounded-xl border border-brand-line bg-brand-raised px-4 py-3.5">
                <p className="text-xs text-brand-muted">Lucro bruto</p>
                <p className="mt-1.5">
                  <ResultValue cents={monthSales.grossProfitCents} size="md" />
                </p>
              </div>
              <div className="rounded-xl border border-brand-line bg-brand-raised px-4 py-3.5">
                <p className="text-xs text-brand-muted">Lucro líquido</p>
                <p className="mt-1.5">
                  <ResultValue cents={monthSales.netProfitCents} size="md" />
                </p>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-brand-muted">
              Lucro bruto desconta apenas a aquisição; o líquido desconta também
              todos os custos variáveis lançados no VIN.
            </p>
          </CardBody>
        </Card>
      </section>

      {/* P&L em três buckets separados */}
      <section className="mt-8">
        <Card>
          <CardHeader
            title="P&L — três buckets"
            subtitle="Custo fixo operacional, custo variável por veículo e custo variável operacional são apurados separadamente e não se misturam."
          />
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Bucket
                title="Custo fixo operacional"
                cents={pnl.fixedOperatingCents}
                detail="Aluguel, folha, licenças e seguros do mês. Não entra no custo de nenhum VIN."
              />
              <Bucket
                title="Custo variável por veículo"
                cents={pnl.variablePerVehicleCents}
                detail="Soma dos custos lançados nos VINs em estoque. É o que compõe o custo final de cada carro."
              />
              <Bucket
                title="Custo variável operacional"
                cents={pnl.variableOperatingCents}
                detail="Marketing, taxas de anúncio e deslocamento. Varia com o volume, mas não pertence a um VIN."
              />
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
}

function Line({ label, cents }: { label: string; cents: number }) {
  return (
    <div className="rounded-xl border border-brand-line bg-brand-raised px-4 py-3.5">
      <p className="text-xs text-brand-muted">{label}</p>
      <p className="mt-1.5 text-lg font-semibold tabular text-brand-white">
        {money(cents)}
      </p>
    </div>
  );
}

function Bucket({
  title,
  cents,
  detail,
}: {
  title: string;
  cents: number;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-brand-line bg-brand-raised px-4 py-4">
      <p className="text-xs font-medium text-brand-white">{title}</p>
      <p className="mt-2 text-xl font-semibold tabular text-brand-white">
        {money(cents)}
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-brand-muted">{detail}</p>
    </div>
  );
}
