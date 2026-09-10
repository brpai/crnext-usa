"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { PageHeader } from "@/components/shell";
import { listLedgerEntries } from "@/lib/data/finance";
import { FinanceNav } from "../finance-ui";
import { Payables } from "./payables";

export default function AccountsPayablePage() {
  const q = useAsync(() => listLedgerEntries(), []);
  if (q.status === "loading") return <PageSkeleton cards={4} />;

  return (
    <>
      <PageHeader
        title="Contas a pagar e receber"
        description="Tudo o que está pendente, pelo vencimento. A baixa registra o pagamento ou o recebimento com a data de hoje e entra no caixa."
      />
      <FinanceNav />
      <Payables initialEntries={q.data} />
    </>
  );
}
