"use client";

import * as React from "react";
import Link from "next/link";
import type { InvestorPosition } from "@/lib/types";
import { isSold } from "@/lib/types";
import { miles, money, vehicleLabel } from "@/lib/format";
import { Card, EmptyState, Field, Select, cn } from "@/components/ui";
import { assetUrl } from "@/lib/base";
import {
  AgingBadge,
  ResultPlaceholder,
  ResultValue,
  VehicleStatusBadge,
} from "@/components/finance";

type StatusFilter = "todos" | "em_estoque" | "vendido";
type Sort = "aging_desc" | "aging_asc" | "capital_desc";

export function VehicleGrid({ positions }: { positions: InvestorPosition[] }) {
  const [status, setStatus] = React.useState<StatusFilter>("todos");
  const [sort, setSort] = React.useState<Sort>("aging_desc");

  const visible = React.useMemo(() => {
    const filtered = positions.filter((p) => {
      if (status === "todos") return true;
      if (status === "vendido") return isSold(p.vehicle);
      return !isSold(p.vehicle);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "capital_desc")
        return b.allocation.amountCents - a.allocation.amountCents;
      if (sort === "aging_asc")
        return a.vehicle.daysInStock - b.vehicle.daysInStock;
      return b.vehicle.daysInStock - a.vehicle.daysInStock;
    });
  }, [positions, status, sort]);

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-md">
        <Field label="Status" htmlFor="filtro-status">
          <Select
            id="filtro-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="todos">Todos</option>
            <option value="em_estoque">Em estoque</option>
            <option value="vendido">Vendidos</option>
          </Select>
        </Field>
        <Field label="Ordenar por" htmlFor="filtro-ordem">
          <Select
            id="filtro-ordem"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="aging_desc">Mais tempo em estoque</option>
            <option value="aging_asc">Menos tempo em estoque</option>
            <option value="capital_desc">Maior capital alocado</option>
          </Select>
        </Field>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="Nenhum veículo neste filtro"
          description="Ajuste o filtro de status para ver os demais veículos da sua posição."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => (
            <VehicleCard key={p.allocation.id} position={p} />
          ))}
        </ul>
      )}
    </>
  );
}

function VehicleCard({ position }: { position: InvestorPosition }) {
  const { vehicle, allocation } = position;
  const sold = isSold(vehicle);

  return (
    <li>
      <Link href={`/veiculos/${vehicle.id}`} className="block h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-brand-muted">
          <div className="aspect-[8/5] w-full overflow-hidden bg-brand-raised">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl(vehicle.photos[0])}
              alt={`${vehicleLabel(vehicle)} — foto do veículo`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4">
            <div>
              <h3 className="text-sm font-semibold leading-snug text-brand-white">
                {vehicleLabel(vehicle)}
              </h3>
              <p className="mt-1 text-xs text-brand-muted">
                {miles(vehicle.mileage)} · {vehicle.color}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <AgingBadge days={vehicle.daysInStock} />
              <VehicleStatusBadge status={vehicle.status} />
            </div>

            <dl className="mt-auto space-y-2 border-t border-brand-line pt-3 text-xs">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-brand-muted">Seu capital neste veículo</dt>
                <dd className="tabular font-medium text-brand-white">
                  {money(allocation.amountCents)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-brand-muted">Sua participação</dt>
                <dd className="tabular text-brand-white">
                  {allocation.sharePercent.toFixed(1).replace(".", ",")}%
                </dd>
              </div>

              {/* Lucro realizado SÓ existe no card de veículo vendido. */}
              <div
                className={cn(
                  "flex items-baseline justify-between gap-3 border-t border-brand-line/60 pt-2"
                )}
              >
                {sold ? (
                  <>
                    <dt className="text-brand-muted">
                      {vehicle.netProfitCents >= 0
                        ? "Lucro líquido realizado"
                        : "Prejuízo realizado"}
                    </dt>
                    <dd>
                      <ResultValue cents={vehicle.netProfitCents} size="sm" />
                    </dd>
                  </>
                ) : (
                  <dd className="w-full">
                    <ResultPlaceholder />
                  </dd>
                )}
              </div>
            </dl>
          </div>
        </Card>
      </Link>
    </li>
  );
}
