"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { listRequests } from "@/lib/data/requests";
import { listInvestors } from "@/lib/data/investors";
import { PageHeader } from "@/components/shell";
import { RequestQueue } from "./request-queue";

export default function AdminRequestsPage() {
  const q = useAsync(
    async () =>
      Promise.all([listRequests(), listInvestors()]).then(([r, i]) => ({
        requests: r,
        investors: i,
      })),
    []
  );
  if (q.status === "loading") return <PageSkeleton cards={2} />;
  const { requests, investors } = q.data;

  const names: Record<string, string> = {};
  for (const i of investors) names[i.id] = i.name;

  const open = requests.filter(
    (r) => r.status === "pendente" || r.status === "em_analise"
  ).length;

  return (
    <>
      <PageHeader
        title="Solicitações de aporte"
        description={`${open} em aberto de ${requests.length} no total.`}
      />
      <RequestQueue requests={requests} investorNames={names} />
    </>
  );
}
