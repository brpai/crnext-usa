"use client";

import { useAsync, useInvestorId } from "@/lib/hooks";
import { getInvestorMovements } from "@/lib/data/movements";
import { listVehicles } from "@/lib/data/vehicles";
import { PageHeader } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
import { StatementTable } from "./statement-table";
import { vehicleLabel } from "@/lib/format";

export default function StatementPage() {
  const investorId = useInvestorId();

  const q = useAsync(async () => {
    if (!investorId) return null;
    const [rows, vehicles] = await Promise.all([
      getInvestorMovements(investorId),
      listVehicles(),
    ]);
    const vehicleNames: Record<string, string> = {};
    for (const v of vehicles) vehicleNames[v.id] = vehicleLabel(v);
    return { rows, vehicleNames };
  }, [investorId]);

  if (q.status === "loading" || !q.data) return <PageSkeleton cards={3} />;

  return (
    <>
      <PageHeader
        title="Extrato"
        description="Todos os movimentos da sua posição: aportes, alocações em veículos, devoluções de capital e distribuições de lucro já pagas."
      />
      <StatementTable rows={q.data.rows} vehicleNames={q.data.vehicleNames} />
    </>
  );
}
