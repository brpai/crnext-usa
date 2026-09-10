"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Role, SessionUser } from "./types";
import { readSession } from "./session";

/**
 * Ponte entre a camada de dados (assíncrona, igual à do Supabase) e as telas.
 *
 * `lib/data/*` continua sendo o único caminho para dado — o que muda no export
 * estático é apenas ONDE a chamada acontece: no cliente, em vez de no servidor.
 * A assinatura das funções não muda, então a troca por Supabase segue valendo.
 */

export type AsyncState<T> =
  | { status: "loading"; data: null }
  | { status: "ready"; data: T };

export function useAsync<T>(
  load: () => Promise<T>,
  deps: React.DependencyList
): AsyncState<T> {
  const [state, setState] = React.useState<AsyncState<T>>({
    status: "loading",
    data: null,
  });

  React.useEffect(() => {
    let alive = true;
    setState({ status: "loading", data: null });
    load().then((data) => {
      if (alive) setState({ status: "ready", data });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

/**
 * Sessão de demonstração; `undefined` enquanto o cookie ainda não foi lido.
 * Relida a cada troca de tela: acesso revogado cai na próxima navegação.
 */
export function useSession(): SessionUser | null | undefined {
  const pathname = usePathname();
  const [session, setSession] = React.useState<SessionUser | null | undefined>(
    undefined
  );
  React.useEffect(() => setSession(readSession()), [pathname]);
  return session;
}

/** Tela inicial de cada papel. */
export function homeFor(role: Role): string {
  return role === "investidor" ? "/" : "/admin";
}

/**
 * Guarda de navegação. Sem sessão → login; papel fora dos permitidos → área do
 * próprio papel. É conveniência de UX, não segurança: num backend real quem
 * barra é a RLS.
 */
export function useRequireRole(allowed: Role | Role[]): SessionUser | undefined {
  const session = useSession();
  const router = useRouter();
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  const rolesKey = roles.join(",");

  React.useEffect(() => {
    if (session === undefined) return;
    if (session === null) router.replace("/login");
    else if (!rolesKey.split(",").includes(session.role))
      router.replace(homeFor(session.role));
  }, [session, rolesKey, router]);

  if (!session || !roles.includes(session.role)) return undefined;
  return session;
}

export function useInvestorId(): string | undefined {
  const session = useRequireRole("investidor");
  return session?.investorId ?? undefined;
}
