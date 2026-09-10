"use client";

import { useAsync, useRequireRole } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { listAccessGrants } from "@/lib/data/access";
import { listInvestors } from "@/lib/data/investors";
import { PageHeader } from "@/components/shell";
import { plural } from "@/lib/format";
import { AccessManager } from "./access-manager";

export default function AdminAccessPage() {
  // Colaborador opera o painel, mas não gerencia acessos.
  const session = useRequireRole("admin");
  const q = useAsync(
    async () =>
      Promise.all([listAccessGrants(), listInvestors()]).then(
        ([grants, investors]) => ({ grants, investors })
      ),
    []
  );
  if (!session || q.status === "loading") return <PageSkeleton cards={2} />;

  const active = q.data.grants.filter((g) => g.status === "ativo").length;

  return (
    <>
      <PageHeader
        title="Acessos"
        description={`Somente e-mails autorizados aqui conseguem entrar no portal. ${plural(active, "acesso ativo", "acessos ativos")}.`}
      />
      <AccessManager
        initialGrants={q.data.grants}
        investors={q.data.investors}
        actor={{ email: session.email, name: session.displayName }}
      />
    </>
  );
}
