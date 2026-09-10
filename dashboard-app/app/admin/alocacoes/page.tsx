"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { listAllocations } from "@/lib/data/admin";
import { listInvestors } from "@/lib/data/investors";
import { listVehicles } from "@/lib/data/vehicles";
import { isSold } from "@/lib/types";
import { PageHeader } from "@/components/shell";
import { AllocationScreen } from "./allocation-screen";

export default function AdminAllocationsPage() {
  const q = useAsync(
    async () =>
      Promise.all([listAllocations(), listInvestors(), listVehicles()]).then(
        ([al, inv, veh]) => ({ allocations: al, investors: inv, vehicles: veh })
      ),
    []
  );
  if (q.status === "loading") return <PageSkeleton cards={3} />;
  const { allocations, investors, vehicles } = q.data;

  const funded: Record<string, number> = {};
  for (const a of allocations) {
    funded[a.vehicleId] = (funded[a.vehicleId] ?? 0) + a.amountCents;
  }

  return (
    <>
      <PageHeader
        title="Alocações"
        description="Vincula capital de um investidor a um VIN. A soma das alocações nunca pode passar do custo final do veículo, nem o valor pode exceder o capital disponível do investidor."
      />
      <AllocationScreen
        allocations={allocations}
        investors={investors}
        vehicles={vehicles.filter((v) => !isSold(v))}
        allVehicles={vehicles}
        funded={funded}
      />
    </>
  );
}
