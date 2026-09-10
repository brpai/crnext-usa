"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { PageHeader } from "@/components/shell";
import { listLedgerEntries } from "@/lib/data/finance";
import { listVehicles } from "@/lib/data/vehicles";
import { FinanceNav } from "../finance-ui";
import { LedgerManager } from "./ledger-manager";

export default function LedgerPage() {
  const q = useAsync(
    async () =>
      Promise.all([listLedgerEntries(), listVehicles()]).then(([entries, vehicles]) => ({
        entries,
        vehicles,
      })),
    []
  );
  if (q.status === "loading") return <PageSkeleton cards={3} />;

  return (
    <>
      <PageHeader
        title="Lançamentos"
        description="Entradas e saídas da empresa. Nada é apagado: conta pendente se cancela e lançamento pago se corrige com estorno — tudo registrado na auditoria."
      />
      <FinanceNav />
      <LedgerManager initialEntries={q.data.entries} vehicles={q.data.vehicles} />
    </>
  );
}
