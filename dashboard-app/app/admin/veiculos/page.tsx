"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { listVehicles } from "@/lib/data/vehicles";
import { listAllocations } from "@/lib/data/admin";
import { isSold } from "@/lib/types";
import { PageHeader } from "@/components/shell";
import { StockTable } from "./stock-table";

export default function AdminVehiclesPage() {
  const q = useAsync(
    async () =>
      Promise.all([listVehicles(), listAllocations()]).then(([v, a]) => ({
        vehicles: v,
        allocations: a,
      })),
    []
  );
  if (q.status === "loading") return <PageSkeleton cards={3} />;
  const { vehicles, allocations } = q.data;

  const funding: Record<string, number> = {};
  for (const a of allocations) {
    funding[a.vehicleId] = (funding[a.vehicleId] ?? 0) + a.amountCents;
  }

  const inStock = vehicles.filter((v) => !isSold(v));

  return (
    <>
      <PageHeader
        title="Estoque"
        description={`${vehicles.length} veículos cadastrados · ${inStock.length} em estoque. Lançamento de custos por VIN e marcação de venda com rateio automático.`}
      />
      <StockTable vehicles={vehicles} funding={funding} />
    </>
  );
}
