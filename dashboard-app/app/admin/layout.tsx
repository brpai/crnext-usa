"use client";

import { useRequireRole } from "@/lib/hooks";
import { adminNavFor, Shell } from "@/components/shell";
import { PageSkeleton } from "@/components/loading";
import { ROLE_LABEL } from "@/lib/format";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useRequireRole(["admin", "colaborador"]);

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <Shell
      nav={adminNavFor(session.role)}
      areaLabel="Painel administrativo"
      userName={session.displayName}
      userMeta={`${ROLE_LABEL[session.role]} · CarNext`}
      showRiskFooter={false}
    >
      {children}
    </Shell>
  );
}
