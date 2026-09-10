"use client";

import { useAsync, useInvestorId } from "@/lib/hooks";
import { getInvestorPositions } from "@/lib/data/portfolio";
import { PageHeader } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
import { VehicleGrid } from "./vehicle-grid";
import { RIGHT_LABEL } from "@/lib/copy";
import { EmptyState } from "@/components/ui";

export default function VehiclesPage() {
  const investorId = useInvestorId();
  const q = useAsync(
    async () => (investorId ? await getInvestorPositions(investorId) : null),
    [investorId]
  );

  if (q.status === "loading" || !q.data) return <PageSkeleton cards={3} />;

  return (
    <>
      <PageHeader
        title="Veículos"
        description={`Todos os veículos em que você tem capital alocado. Seu direito é de ${RIGHT_LABEL}.`}
      />
      {q.data.length === 0 ? (
        <EmptyState
          title="Você ainda não tem capital alocado"
          description="Assim que houver capital seu alocado a um veículo, ele aparece aqui com ficha, custos e tempo de estoque."
        />
      ) : (
        <VehicleGrid positions={q.data} />
      )}
    </>
  );
}
