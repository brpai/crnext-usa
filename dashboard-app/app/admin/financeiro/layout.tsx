"use client";

import { useRequireRole } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";

/** Financeiro da empresa: somente Admin. Colaborador volta para a Operação. */
export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useRequireRole("admin");
  if (!session) return <PageSkeleton cards={4} />;
  return <>{children}</>;
}
