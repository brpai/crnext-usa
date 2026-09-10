"use client";

import { useRequireRole } from "@/lib/hooks";
import { INVESTOR_NAV, Shell } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useRequireRole("investidor");

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <Shell
      nav={INVESTOR_NAV}
      areaLabel="Portal do Investidor"
      userName={session.displayName}
      userMeta="Investidor"
      showRiskFooter
    >
      {children}
    </Shell>
  );
}
