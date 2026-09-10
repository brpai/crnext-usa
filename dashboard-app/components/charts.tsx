"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CapitalByVehicleSlice, RealizedMonthPoint } from "@/lib/types";
import { money, moneyShort, monthLabel, percent } from "@/lib/format";

/**
 * Gráficos.
 *
 * Regra: só entram séries de dados REALIZADOS. Nenhum gráfico traz linha de
 * tendência, projeção, extrapolação ou eixo que se estenda além do último
 * mês com fato registrado.
 */

const GRID = "#DFD4CB";
const AXIS = "#5E7079";
const SERIES_ALLOCATED = "#043A53";
const SERIES_DISTRIBUTED = "#6AA4A8";
const DONUT = ["#043A53", "#6AA4A8", "#2E6B7D", "#9CC4C6", "#5E7079", "#C3D8D9"];

function TooltipBox({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-brand-line bg-brand-surface px-3 py-2 shadow-lg">
      {label !== undefined ? (
        <p className="mb-1 text-xs font-medium text-brand-white">
          {typeof label === "string" && /^\d{4}-\d{2}$/.test(label)
            ? monthLabel(label)
            : label}
        </p>
      ) : null}
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-brand-soft">
          <span
            className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
            style={{ background: p.color }}
          />
          {p.name}: <span className="tabular text-brand-white">{money(Number(p.value ?? 0))}</span>
        </p>
      ))}
    </div>
  );
}

/** Histórico realizado, mês a mês. Somente meses passados. */
export function RealizedHistoryChart({
  data,
}: {
  data: RealizedMonthPoint[];
}) {
  if (!data.length) {
    return (
      <p className="py-10 text-center text-xs text-brand-muted">
        Ainda não há movimentos registrados.
      </p>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
          <XAxis
            dataKey="month"
            tickFormatter={monthLabel}
            tick={{ fill: AXIS, fontSize: 11 }}
            axisLine={{ stroke: GRID }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => moneyShort(v)}
            tick={{ fill: AXIS, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={78}
          />
          <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(4,58,83,0.05)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: AXIS, paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="allocatedCents"
            name="Capital alocado"
            fill={SERIES_ALLOCATED}
            radius={[4, 4, 0, 0]}
            maxBarSize={34}
          />
          <Bar
            dataKey="distributedCents"
            name="Lucro distribuído"
            fill={SERIES_DISTRIBUTED}
            radius={[4, 4, 0, 0]}
            maxBarSize={34}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Onde o dinheiro do investidor está agora. */
export function CapitalByVehicleChart({
  data,
}: {
  data: CapitalByVehicleSlice[];
}) {
  if (!data.length) {
    return (
      <p className="py-10 text-center text-xs text-brand-muted">
        Nenhum capital alocado a veículos em estoque no momento.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-[200px] w-full sm:w-[200px] sm:shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amountCents"
              nameKey="label"
              innerRadius={54}
              outerRadius={86}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={DONUT[i % DONUT.length]} />
              ))}
            </Pie>
            <Tooltip content={<TooltipBox />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="min-w-0 flex-1 space-y-2">
        {data.map((slice, i) => (
          <li
            key={slice.vehicleId}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: DONUT[i % DONUT.length] }}
                aria-hidden="true"
              />
              <span className="truncate text-brand-soft">{slice.label}</span>
            </span>
            <span className="shrink-0 tabular text-brand-white">
              {money(slice.amountCents)}{" "}
              <span className="text-brand-muted">({percent(slice.percent, 0)})</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Distribuição de aging do estoque (admin). */
export function AgingChart({
  data,
}: {
  data: Array<{ label: string; count: number }>;
}) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: AXIS, fontSize: 11 }}
            axisLine={{ stroke: GRID }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: AXIS, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            cursor={{ fill: "rgba(4,58,83,0.05)" }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-xl border border-brand-line bg-brand-surface px-3 py-2">
                  <p className="text-xs text-brand-white">
                    {label}: {payload[0].value} veículos
                  </p>
                </div>
              ) : null
            }
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={i === 0 ? "#15704F" : i === 1 ? "#8A5A00" : "#A62015"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
