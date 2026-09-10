"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  CapitalByVehicleSlice,
  CashFlowMonth,
  InvestorPositionRow,
  RealizedMonthPoint,
  Vehicle,
  VehicleCost,
} from "@/lib/types";
import {
  COST_CATEGORY_LABEL,
  date,
  money,
  moneyShort,
  moneySigned,
  monthLabel,
  percent,
  vehicleLabel,
} from "@/lib/format";
import { Table, Td, Th, TotalRow, cn } from "@/components/ui";

/**
 * Gráficos.
 *
 * Regra: só entram séries de dados REALIZADOS. Nenhum gráfico traz linha de
 * tendência, projeção, extrapolação ou eixo que se estenda além do último
 * fato registrado. Todo gráfico tem uma visão em tabela equivalente.
 *
 * Paleta derivada das cores da marca e validada (validate_palette.js, modo
 * claro, fundo #FFFFFF): série 1 #07618f · série 2 #41b2b2 — separação para
 * daltonismo ΔE 24,5 (alvo ≥ 8). O teal fica abaixo de 3:1 de contraste; a
 * compensação é legenda, rótulos diretos e a visão em tabela.
 * Uma série só usa a série 1. Aging usa as cores de STATUS: ali a cor
 * significa estado (ok / atenção / crítico), não identidade.
 */

export const SERIES_1 = "#07618f";
export const SERIES_2 = "#41b2b2";
const GRID = "#EDE4DC";
const BASELINE = "#DFD4CB";
const AXIS = "#5E7079";
const INK = "#043A53";
const SURFACE = "#FFFFFF";
const HOVER = "rgba(4,58,83,0.04)";
const TICK = { fill: AXIS, fontSize: 11 };

/* ─────────────────────────── Gráfico | Tabela ─────────────────────────── */

export type ViewMode = "grafico" | "tabela";

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Forma de exibição"
      className="inline-flex rounded-xl border border-brand-line bg-brand-raised p-0.5"
    >
      {(["grafico", "tabela"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
            value === mode
              ? "bg-brand-surface text-brand-white shadow-sm"
              : "text-brand-muted hover:text-brand-white"
          )}
        >
          {mode === "grafico" ? "Gráfico" : "Tabela"}
        </button>
      ))}
    </div>
  );
}

/* ──────────────────────────────── Peças ───────────────────────────────── */

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-10 text-center text-xs text-brand-muted">{children}</p>
  );
}

interface LegendItem {
  name: string;
  color: string;
}

function LegendRow({ items }: { items: LegendItem[] }) {
  return (
    <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
      {items.map((item) => (
        <li
          key={item.name}
          className="flex items-center gap-1.5 text-[11px] text-brand-soft"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-[3px]"
            style={{ background: item.color }}
          />
          {item.name}
        </li>
      ))}
    </ul>
  );
}

interface TipRow {
  name: string;
  value: number;
  color: string;
}

/** Valor em destaque, nome da série secundário, chave em traço curto. */
function Tip({
  title,
  rows,
  footer,
}: {
  title: string;
  rows: TipRow[];
  footer?: string;
}) {
  return (
    <div className="min-w-[170px] rounded-xl border border-brand-line bg-brand-surface px-3 py-2 shadow-lg">
      <p className="mb-1.5 text-[11px] text-brand-muted">{title}</p>
      <ul className="space-y-1">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden="true"
              className="h-0.5 w-3 shrink-0 rounded-full"
              style={{ background: r.color }}
            />
            <span className="tabular font-semibold text-brand-white">
              {money(r.value)}
            </span>
            <span className="text-brand-muted">{r.name}</span>
          </li>
        ))}
      </ul>
      {footer ? (
        <p className="mt-1.5 border-t border-brand-line pt-1.5 text-[11px] text-brand-muted">
          {footer}
        </p>
      ) : null}
    </div>
  );
}

const truncate = (v: string) => (v.length > 24 ? `${v.slice(0, 23)}…` : v);

/** 08/11/25 — data curta para eixo, sem colidir com os rótulos de valor. */
function shortDay(t: number): string {
  const d = new Date(t);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${String(d.getUTCFullYear()).slice(2)}`;
}

interface HBarRow {
  key: string;
  label: string;
  value: number;
  /** Texto na ponta da barra. */
  tip: string;
  note?: string;
}

/** Barras horizontais de UMA série: rótulo de valor na ponta de cada barra. */
function HBars({ rows, seriesName }: { rows: HBarRow[]; seriesName: string }) {
  return (
    <div className="w-full" style={{ height: rows.length * 40 + 8 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 0, right: 132, bottom: 0, left: 0 }}
          barCategoryGap={10}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={156}
            tick={TICK}
            tickFormatter={truncate}
            axisLine={{ stroke: BASELINE }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: HOVER }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <Tip
                  title={String(payload[0].payload.label)}
                  rows={[
                    {
                      name: seriesName,
                      value: Number(payload[0].value ?? 0),
                      color: SERIES_1,
                    },
                  ]}
                  footer={payload[0].payload.note}
                />
              ) : null
            }
          />
          <Bar
            dataKey="value"
            name={seriesName}
            fill={SERIES_1}
            radius={[0, 4, 4, 0]}
            maxBarSize={24}
            isAnimationActive={false}
          >
            <LabelList dataKey="tip" position="right" fill={INK} fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface StackSeries {
  key: string;
  name: string;
  color: string;
}

type StackRow = { name: string; label: string; total: number } & Record<
  string,
  string | number
>;

/** Barras horizontais empilhadas: total na ponta, legenda sempre visível. */
function StackedHBars({
  data,
  series,
  totalName,
}: {
  data: StackRow[];
  series: StackSeries[];
  totalName: string;
}) {
  const last = series.length - 1;
  return (
    <div>
      <LegendRow items={series} />
      <div className="w-full" style={{ height: data.length * 44 + 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 96, bottom: 0, left: 0 }}
            barCategoryGap={12}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={156}
              tick={TICK}
              tickFormatter={truncate}
              axisLine={{ stroke: BASELINE }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: HOVER }}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <Tip
                    title={String(payload[0].payload.name)}
                    rows={payload.map((p) => ({
                      name: String(p.name),
                      value: Number(p.value ?? 0),
                      color: String(p.color),
                    }))}
                    footer={`${totalName}: ${money(Number(payload[0].payload.total))}`}
                  />
                ) : null
              }
            />
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                stackId="total"
                fill={s.color}
                stroke={SURFACE}
                strokeWidth={i < last ? 2 : 0}
                radius={i === last ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                maxBarSize={24}
                isAnimationActive={false}
              >
                {i === last ? (
                  <LabelList dataKey="label" position="right" fill={INK} fontSize={11} />
                ) : null}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─────────────────────── Visão geral do investidor ──────────────────────── */

/** Histórico realizado, mês a mês. Somente meses passados. */
export function RealizedHistoryChart({ data }: { data: RealizedMonthPoint[] }) {
  if (!data.length) return <Empty>Ainda não há movimentos registrados.</Empty>;

  return (
    <div>
      <LegendRow
        items={[
          { name: "Capital alocado", color: SERIES_1 },
          { name: "Lucro distribuído", color: SERIES_2 },
        ]}
      />
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            barGap={2}
            barCategoryGap="30%"
          >
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis
              dataKey="month"
              tickFormatter={monthLabel}
              tick={TICK}
              axisLine={{ stroke: BASELINE }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => moneyShort(v)}
              tick={TICK}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              cursor={{ fill: HOVER }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <Tip
                    title={monthLabel(String(label))}
                    rows={payload.map((p) => ({
                      name: String(p.name),
                      value: Number(p.value ?? 0),
                      color: String(p.color),
                    }))}
                  />
                ) : null
              }
            />
            <Bar
              dataKey="allocatedCents"
              name="Capital alocado"
              fill={SERIES_1}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
            <Bar
              dataKey="distributedCents"
              name="Lucro distribuído"
              fill={SERIES_2}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RealizedHistoryTable({ data }: { data: RealizedMonthPoint[] }) {
  if (!data.length) return <Empty>Ainda não há movimentos registrados.</Empty>;
  const allocated = data.reduce((n, d) => n + d.allocatedCents, 0);
  const distributed = data.reduce((n, d) => n + d.distributedCents, 0);

  return (
    <Table>
      <thead>
        <tr>
          <Th>Mês</Th>
          <Th align="right">Capital alocado</Th>
          <Th align="right">Lucro distribuído</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.month}>
            <Td>{monthLabel(d.month)}</Td>
            <Td align="right">{money(d.allocatedCents)}</Td>
            <Td align="right">{money(d.distributedCents)}</Td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <TotalRow>
          <Td className="border-b-0">Total</Td>
          <Td align="right" className="border-b-0">
            {money(allocated)}
          </Td>
          <Td align="right" className="border-b-0">
            {money(distributed)}
          </Td>
        </TotalRow>
      </tfoot>
    </Table>
  );
}

/** Onde o dinheiro do investidor está agora — barras, do maior ao menor. */
export function CapitalByVehicleChart({ data }: { data: CapitalByVehicleSlice[] }) {
  if (!data.length) {
    return (
      <Empty>Nenhum capital alocado a veículos em estoque no momento.</Empty>
    );
  }
  const rows = [...data]
    .sort((a, b) => b.amountCents - a.amountCents)
    .map((s) => ({
      key: s.vehicleId,
      label: s.label,
      value: s.amountCents,
      tip: `${moneyShort(s.amountCents)} · ${percent(s.percent, 0)}`,
      note: `${percent(s.percent, 1)} do seu capital alocado`,
    }));
  return <HBars rows={rows} seriesName="Capital alocado" />;
}

export function CapitalByVehicleTable({ data }: { data: CapitalByVehicleSlice[] }) {
  if (!data.length) {
    return (
      <Empty>Nenhum capital alocado a veículos em estoque no momento.</Empty>
    );
  }
  const total = data.reduce((n, s) => n + s.amountCents, 0);
  return (
    <Table>
      <thead>
        <tr>
          <Th>Veículo</Th>
          <Th align="right">Capital</Th>
          <Th align="right">Participação</Th>
        </tr>
      </thead>
      <tbody>
        {[...data]
          .sort((a, b) => b.amountCents - a.amountCents)
          .map((s) => (
            <tr key={s.vehicleId}>
              <Td>{s.label}</Td>
              <Td align="right">{money(s.amountCents)}</Td>
              <Td align="right">{percent(s.percent, 1)}</Td>
            </tr>
          ))}
      </tbody>
      <tfoot>
        <TotalRow>
          <Td className="border-b-0">Total</Td>
          <Td align="right" className="border-b-0">
            {money(total)}
          </Td>
          <Td align="right" className="border-b-0">
            100%
          </Td>
        </TotalRow>
      </tfoot>
    </Table>
  );
}

/* ──────────────────────────────── Extrato ─────────────────────────────── */

/**
 * Saldo em custódia ao longo do tempo, em degraus: o saldo muda no dia do
 * movimento e fica parado até o próximo. Um ponto por dia (saldo ao fim do dia).
 */
export function BalanceChart({
  rows,
}: {
  rows: Array<{ date: string; balanceCents: number }>;
}) {
  const byDay = new Map<string, number>();
  for (const r of rows) byDay.set(r.date, r.balanceCents);
  const data = [...byDay.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([d, balance]) => ({ t: Date.parse(`${d}T00:00:00Z`), day: d, balance }));

  if (!data.length) return <Empty>Nenhum movimento no período.</Empty>;
  const lastPoint = data[data.length - 1];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs text-brand-muted">
          Saldo em custódia após cada movimento
        </p>
        <p className="text-xs text-brand-muted">
          Em {date(lastPoint.day)}:{" "}
          <span className="tabular font-semibold text-brand-white">
            {money(lastPoint.balance)}
          </span>
        </p>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={shortDay}
              tick={TICK}
              tickMargin={8}
              padding={{ left: 12, right: 4 }}
              axisLine={{ stroke: BASELINE }}
              tickLine={false}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={(v: number) => moneyShort(v)}
              tick={TICK}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              cursor={{ stroke: AXIS, strokeWidth: 1 }}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <Tip
                    title={date(String(payload[0].payload.day))}
                    rows={[
                      {
                        name: "Saldo em custódia",
                        value: Number(payload[0].value ?? 0),
                        color: SERIES_1,
                      },
                    ]}
                  />
                ) : null
              }
            />
            <Area
              type="stepAfter"
              dataKey="balance"
              name="Saldo em custódia"
              stroke={SERIES_1}
              strokeWidth={2}
              fill={SERIES_1}
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 4, fill: SERIES_1, stroke: SURFACE, strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ──────────────────────────── Ficha do veículo ──────────────────────────── */

/** Custos lançados agregados por categoria, do maior ao menor. */
export function CostByCategoryChart({ costs }: { costs: VehicleCost[] }) {
  const totals = new Map<string, number>();
  for (const c of costs) {
    totals.set(c.category, (totals.get(c.category) ?? 0) + c.amountCents);
  }
  const sum = costs.reduce((n, c) => n + c.amountCents, 0);
  const rows = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, value]) => {
      const share = sum ? (value / sum) * 100 : 0;
      return {
        key: category,
        label: COST_CATEGORY_LABEL[category] ?? category,
        value,
        tip: `${moneyShort(value)} · ${percent(share, 0)}`,
        note: `${percent(share, 1)} dos custos variáveis`,
      };
    });

  if (!rows.length) return <Empty>Nenhum custo lançado ainda.</Empty>;
  return <HBars rows={rows} seriesName="Custos lançados" />;
}

/* ─────────────────────────────────── Admin ──────────────────────────────── */

/** Aporte de cada investidor dividido em alocado × disponível. */
export function CapitalByInvestorChart({ rows }: { rows: InvestorPositionRow[] }) {
  if (!rows.length) return <Empty>Nenhum investidor cadastrado.</Empty>;
  const data: StackRow[] = rows.map((r) => ({
    name: r.investor.name,
    allocated: r.allocatedCents,
    available: r.availableCents,
    total: r.contributedCents,
    label: moneyShort(r.contributedCents),
  }));
  return (
    <StackedHBars
      data={data}
      series={[
        { key: "allocated", name: "Alocado em veículos", color: SERIES_1 },
        { key: "available", name: "Disponível em custódia", color: SERIES_2 },
      ]}
      totalName="Aportado"
    />
  );
}

/** Composição do custo final de cada veículo: aquisição + custos variáveis. */
export function CostCompositionChart({ vehicles }: { vehicles: Vehicle[] }) {
  if (!vehicles.length) return <Empty>Nenhum veículo no filtro atual.</Empty>;
  const data: StackRow[] = vehicles.map((v) => ({
    name: vehicleLabel(v),
    acquisition: v.acquisitionCostCents,
    variable: v.variableCostsCents,
    total: v.landedCostCents,
    label: moneyShort(v.landedCostCents),
  }));
  return (
    <StackedHBars
      data={data}
      series={[
        { key: "acquisition", name: "Aquisição", color: SERIES_1 },
        { key: "variable", name: "Custos variáveis", color: SERIES_2 },
      ]}
      totalName="Custo final"
    />
  );
}

/** Distribuição de aging do estoque (admin). Cor = status, com rótulo no eixo. */
export function AgingChart({
  data,
}: {
  data: Array<{ label: string; count: number }>;
}) {
  const status = ["#15704F", "#8A5A00", "#A62015"];
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis
            dataKey="label"
            tick={TICK}
            axisLine={{ stroke: BASELINE }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={TICK}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            cursor={{ fill: HOVER }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-xl border border-brand-line bg-brand-surface px-3 py-2 shadow-lg">
                  <p className="text-xs">
                    <span className="tabular font-semibold text-brand-white">
                      {payload[0].value}
                    </span>{" "}
                    <span className="text-brand-muted">veículos · {label}</span>
                  </p>
                </div>
              ) : null
            }
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false}>
            {data.map((_, i) => (
              <Cell key={i} fill={status[Math.min(i, status.length - 1)]} />
            ))}
            <LabelList dataKey="count" position="top" fill={INK} fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────────────────────────── Financeiro ─────────────────────────────── */

/** Cores de STATUS: o resultado positivo/negativo significa bom/ruim. */
const GAIN = "#15704F";
const LOSS = "#A62015";

/** Receitas × custos por mês — sem capital de investidores. */
export function CashFlowChart({ data }: { data: CashFlowMonth[] }) {
  if (!data.some((d) => d.inCents || d.outCents)) {
    return <Empty>Sem lançamentos pagos no período.</Empty>;
  }
  return (
    <div>
      <LegendRow
        items={[
          { name: "Entradas (receitas)", color: SERIES_1 },
          { name: "Saídas (custos)", color: SERIES_2 },
        ]}
      />
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            barGap={2}
            barCategoryGap="30%"
          >
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis
              dataKey="month"
              tickFormatter={monthLabel}
              tick={TICK}
              axisLine={{ stroke: BASELINE }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => moneyShort(v)}
              tick={TICK}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              cursor={{ fill: HOVER }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <Tip
                    title={monthLabel(String(label))}
                    rows={payload.map((p) => ({
                      name: String(p.name),
                      value: Number(p.value ?? 0),
                      color: String(p.color),
                    }))}
                    footer={`Resultado: ${moneySigned(Number(payload[0].payload.resultCents))}`}
                  />
                ) : null
              }
            />
            <Bar
              dataKey="inCents"
              name="Entradas (receitas)"
              fill={SERIES_1}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
            <Bar
              dataKey="outCents"
              name="Saídas (custos)"
              fill={SERIES_2}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CashFlowTable({ data }: { data: CashFlowMonth[] }) {
  const totals = data.reduce(
    (t, d) => ({ in: t.in + d.inCents, out: t.out + d.outCents }),
    { in: 0, out: 0 }
  );
  return (
    <Table>
      <thead>
        <tr>
          <Th>Mês</Th>
          <Th align="right">Entradas</Th>
          <Th align="right">Saídas</Th>
          <Th align="right">Resultado</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.month}>
            <Td>{monthLabel(d.month)}</Td>
            <Td align="right">{money(d.inCents)}</Td>
            <Td align="right">{money(d.outCents)}</Td>
            <Td align="right">
              <span className={d.resultCents < 0 ? "text-loss" : d.resultCents > 0 ? "text-gain" : ""}>
                {moneySigned(d.resultCents)}
              </span>
            </Td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <TotalRow>
          <Td className="border-b-0">Total</Td>
          <Td align="right" className="border-b-0">
            {money(totals.in)}
          </Td>
          <Td align="right" className="border-b-0">
            {money(totals.out)}
          </Td>
          <Td align="right" className="border-b-0">
            {moneySigned(totals.in - totals.out)}
          </Td>
        </TotalRow>
      </tfoot>
    </Table>
  );
}

/** Resultado de caixa por mês: positivo e negativo com o mesmo peso visual. */
export function MonthlyResultChart({ data }: { data: CashFlowMonth[] }) {
  if (!data.some((d) => d.inCents || d.outCents)) {
    return <Empty>Sem lançamentos pagos no período.</Empty>;
  }
  const rows = data.map((d) => ({
    month: d.month,
    result: d.resultCents,
    positive: Math.max(d.resultCents, 0),
    negative: Math.min(d.resultCents, 0),
  }));
  return (
    <div>
      <LegendRow
        items={[
          { name: "Resultado positivo", color: GAIN },
          { name: "Resultado negativo", color: LOSS },
        ]}
      />
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            stackOffset="sign"
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis
              dataKey="month"
              tickFormatter={monthLabel}
              tick={TICK}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => moneyShort(v)}
              tick={TICK}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <ReferenceLine y={0} stroke={BASELINE} />
            <Tooltip
              cursor={{ fill: HOVER }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const value = Number(payload[0].payload.result);
                return (
                  <div className="min-w-[170px] rounded-xl border border-brand-line bg-brand-surface px-3 py-2 shadow-lg">
                    <p className="mb-1.5 text-[11px] text-brand-muted">
                      {monthLabel(String(label))}
                    </p>
                    <p className="text-xs">
                      <span
                        className={cn(
                          "tabular font-semibold",
                          value < 0 ? "text-loss" : "text-gain"
                        )}
                      >
                        {moneySigned(value)}
                      </span>{" "}
                      <span className="text-brand-muted">resultado de caixa</span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="positive"
              name="Resultado positivo"
              stackId="resultado"
              fill={GAIN}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
            <Bar
              dataKey="negative"
              name="Resultado negativo"
              stackId="resultado"
              fill={LOSS}
              radius={[0, 0, 4, 4]}
              maxBarSize={24}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export interface BreakdownItem {
  key: string;
  label: string;
  cents: number;
}

/** Composição de um total por categoria (uma série, do maior ao menor). */
export function BreakdownChart({
  items,
  seriesName,
  emptyText,
}: {
  items: BreakdownItem[];
  seriesName: string;
  emptyText: string;
}) {
  const positive = items.filter((i) => i.cents > 0).sort((a, b) => b.cents - a.cents);
  if (!positive.length) return <Empty>{emptyText}</Empty>;
  const sum = positive.reduce((n, i) => n + i.cents, 0);
  return (
    <HBars
      seriesName={seriesName}
      rows={positive.map((i) => {
        const share = sum ? (i.cents / sum) * 100 : 0;
        return {
          key: i.key,
          label: i.label,
          value: i.cents,
          tip: `${moneyShort(i.cents)} · ${percent(share, 0)}`,
          note: `${percent(share, 1)} do total`,
        };
      })}
    />
  );
}

export function BreakdownTable({
  items,
  labelHeader,
  emptyText,
}: {
  items: BreakdownItem[];
  labelHeader: string;
  emptyText: string;
}) {
  if (!items.length) return <Empty>{emptyText}</Empty>;
  const sorted = [...items].sort((a, b) => b.cents - a.cents);
  const sum = sorted.reduce((n, i) => n + i.cents, 0);
  return (
    <Table>
      <thead>
        <tr>
          <Th>{labelHeader}</Th>
          <Th align="right">Valor</Th>
          <Th align="right">Participação</Th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((i) => (
          <tr key={i.key}>
            <Td>{i.label}</Td>
            <Td align="right">{money(i.cents)}</Td>
            <Td align="right">{sum ? percent((i.cents / sum) * 100, 1) : "—"}</Td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <TotalRow>
          <Td className="border-b-0">Total</Td>
          <Td align="right" className="border-b-0">
            {money(sum)}
          </Td>
          <Td align="right" className="border-b-0">
            100%
          </Td>
        </TotalRow>
      </tfoot>
    </Table>
  );
}

