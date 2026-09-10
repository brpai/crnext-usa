"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAsync } from "@/lib/hooks";
import { getFinanceOverview } from "@/lib/data/finance";
import type { PendingSummary } from "@/lib/types";
import { PageHeader } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
import { StatCard } from "@/components/finance";
import {
  Card,
  CardBody,
  CardHeader,
  Field,
  LinkButton,
  Select,
  Table,
  Td,
  Th,
  TotalRow,
} from "@/components/ui";
import {
  BreakdownChart,
  BreakdownTable,
  CashFlowChart,
  CashFlowTable,
  MonthlyResultChart,
  ViewToggle,
  type ViewMode,
} from "@/components/charts";
import {
  COST_CENTER_LABEL,
  LEDGER_GROUP_LABEL,
  money,
  moneySigned,
  monthLabel,
  plural,
} from "@/lib/format";
import { FinanceNav } from "./finance-ui";

const ACCOUNT_KIND_LABEL: Record<string, string> = { banco: "Banco", caixa: "Caixa" };

export default function FinanceOverviewPage() {
  const [period, setPeriod] = useState(6);
  const [flowView, setFlowView] = useState<ViewMode>("grafico");
  const [resultView, setResultView] = useState<ViewMode>("grafico");
  const [groupView, setGroupView] = useState<ViewMode>("grafico");
  const [centerView, setCenterView] = useState<ViewMode>("grafico");
  const q = useAsync(() => getFinanceOverview(period), [period]);

  if (q.status === "loading") return <PageSkeleton cards={4} />;
  const o = q.data;

  const groups = o.outByGroup.map((g) => ({
    key: g.group,
    label: LEDGER_GROUP_LABEL[g.group],
    cents: g.cents,
  }));
  const centers = o.outByCostCenter.map((c) => ({
    key: c.costCenter,
    label: COST_CENTER_LABEL[c.costCenter],
    cents: c.cents,
  }));
  const ref = monthLabel(o.referenceMonth);
  const periodText = `${monthLabel(o.months[0])} a ${monthLabel(o.months[o.months.length - 1])}`;

  return (
    <>
      <PageHeader
        title="Financeiro"
        description="Entradas, saídas e custos da CarNext. Capital de investidores passa pelo caixa, mas fica fora do resultado. Dados fictícios de demonstração."
        action={
          <LinkButton href="/admin/financeiro/lancamentos" variant="primary">
            Lançamentos
          </LinkButton>
        }
      />
      <FinanceNav />

      <div className="mb-6 w-full sm:max-w-xs">
        <Field label="Período dos gráficos" htmlFor="fin-periodo">
          <Select
            id="fin-periodo"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          >
            <option value={3}>Últimos 3 meses</option>
            <option value={6}>Últimos 6 meses</option>
            <option value={12}>Últimos 12 meses</option>
          </Select>
        </Field>
      </div>

      <section
        aria-label={`Resumo de ${ref}`}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label={`Entradas — ${ref}`}
          value={money(o.month.inCents)}
          hint="Receitas recebidas no mês. Não inclui aportes de investidores."
        />
        <StatCard
          label={`Saídas — ${ref}`}
          value={money(o.month.outCents)}
          hint="Custos pagos no mês: veículos, fixos, variáveis e impostos."
        />
        <StatCard
          label={`Resultado de caixa — ${ref}`}
          value={moneySigned(o.month.resultCents)}
          tone={o.month.resultCents > 0 ? "gain" : "neutral"}
          hint="Entradas menos saídas, sem capital de investidores."
        />
        <StatCard
          label="Saldo em caixa"
          value={money(o.cashBalanceCents)}
          hint={`Todas as contas. Capital de investidores em ${ref}: ${moneySigned(o.month.investorNetCents)}.`}
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Fluxo de caixa"
            subtitle={`Entradas × saídas por mês, ${periodText}. Sem capital de investidores.`}
            action={<ViewToggle value={flowView} onChange={setFlowView} />}
          />
          <CardBody>
            {flowView === "grafico" ? (
              <CashFlowChart data={o.cashFlow} />
            ) : (
              <CashFlowTable data={o.cashFlow} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Resultado de caixa por mês"
            subtitle="Positivo e negativo com o mesmo destaque. Fatos registrados, não projeção."
            action={<ViewToggle value={resultView} onChange={setResultView} />}
          />
          <CardBody>
            {resultView === "grafico" ? (
              <MonthlyResultChart data={o.cashFlow} />
            ) : (
              <CashFlowTable data={o.cashFlow} />
            )}
          </CardBody>
        </Card>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Saídas por grupo"
            subtitle={`Custo de veículos, fixo, variável operacional e impostos — ${periodText}.`}
            action={<ViewToggle value={groupView} onChange={setGroupView} />}
          />
          <CardBody>
            {groupView === "grafico" ? (
              <BreakdownChart items={groups} seriesName="Saídas" emptyText="Sem saídas pagas no período." />
            ) : (
              <BreakdownTable items={groups} labelHeader="Grupo" emptyText="Sem saídas pagas no período." />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Saídas por centro de custo"
            subtitle={`Loja, veículos, comercial e administrativo — ${periodText}.`}
            action={<ViewToggle value={centerView} onChange={setCenterView} />}
          />
          <CardBody>
            {centerView === "grafico" ? (
              <BreakdownChart items={centers} seriesName="Saídas" emptyText="Sem saídas pagas no período." />
            ) : (
              <BreakdownTable items={centers} labelHeader="Centro de custo" emptyText="Sem saídas pagas no período." />
            )}
          </CardBody>
        </Card>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Saldo por conta"
            subtitle="Saldo inicial mais todos os lançamentos pagos até hoje."
          />
          <CardBody className="px-0 py-0">
            <Table>
              <thead>
                <tr>
                  <Th>Conta</Th>
                  <Th>Tipo</Th>
                  <Th align="right">Saldo</Th>
                </tr>
              </thead>
              <tbody>
                {o.accounts.map((a) => (
                  <tr key={a.account.id}>
                    <Td>{a.account.name}</Td>
                    <Td>
                      <span className="text-xs text-brand-soft">
                        {ACCOUNT_KIND_LABEL[a.account.kind]}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className={a.balanceCents < 0 ? "text-loss" : ""}>
                        {money(a.balanceCents)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <TotalRow>
                  <Td className="border-b-0">Total</Td>
                  <Td className="border-b-0" />
                  <Td align="right" className="border-b-0">
                    {money(o.cashBalanceCents)}
                  </Td>
                </TotalRow>
              </tfoot>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Contas a pagar e receber"
            subtitle="Lançamentos pendentes, por vencimento."
            action={
              <LinkButton href="/admin/financeiro/contas" variant="secondary">
                Ver contas
              </LinkButton>
            }
          />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PendingBox title="A pagar" summary={o.payables} />
            <PendingBox title="A receber" summary={o.receivables} />
          </CardBody>
        </Card>
      </section>
    </>
  );
}

function PendingBox({ title, summary }: { title: string; summary: PendingSummary }) {
  return (
    <div className="rounded-xl border border-brand-line bg-brand-raised px-4 py-3.5">
      <p className="text-xs text-brand-muted">{title}</p>
      <p className="mt-1.5 text-lg font-semibold tabular text-brand-white">
        {money(summary.cents)}
      </p>
      <p className="mt-1 text-[11px] text-brand-muted">
        {plural(summary.count, "conta em aberto", "contas em aberto")}
      </p>
      {summary.overdueCount > 0 ? (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-loss">
          <AlertTriangle size={13} aria-hidden="true" />
          {plural(summary.overdueCount, "atrasada", "atrasadas")} · {money(summary.overdueCents)}
        </p>
      ) : (
        <p className="mt-2 text-[11px] text-brand-muted">Nenhuma atrasada.</p>
      )}
    </div>
  );
}
