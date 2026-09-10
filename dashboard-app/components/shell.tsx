"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Receipt,
  FileText,
  Wallet,
  LifeBuoy,
  Users,
  Layers,
  Inbox,
  ScrollText,
  KeyRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/components/ui";
import { PORTAL_FOOTER } from "@/lib/copy";
import { BASE } from "@/lib/base";
import { clearSession } from "@/lib/session";
import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const INVESTOR_NAV: NavItem[] = [
  { href: "/", label: "Visão geral", icon: <LayoutDashboard size={17} /> },
  { href: "/veiculos", label: "Veículos", icon: <Car size={17} /> },
  { href: "/extrato", label: "Extrato", icon: <Receipt size={17} /> },
  { href: "/contratos", label: "Contratos", icon: <FileText size={17} /> },
  { href: "/aporte", label: "Aporte", icon: <Wallet size={17} /> },
  { href: "/suporte", label: "Suporte", icon: <LifeBuoy size={17} /> },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Operação", icon: <LayoutDashboard size={17} /> },
  { href: "/admin/investidores", label: "Investidores", icon: <Users size={17} /> },
  { href: "/admin/veiculos", label: "Estoque", icon: <Car size={17} /> },
  { href: "/admin/alocacoes", label: "Alocações", icon: <Layers size={17} /> },
  { href: "/admin/contratos", label: "Contratos", icon: <FileText size={17} /> },
  { href: "/admin/solicitacoes", label: "Solicitações", icon: <Inbox size={17} /> },
  { href: "/admin/suporte", label: "Suporte", icon: <LifeBuoy size={17} /> },
  { href: "/admin/auditoria", label: "Auditoria", icon: <ScrollText size={17} /> },
  { href: "/admin/acessos", label: "Acessos", icon: <KeyRound size={17} /> },
];

/** Telas do painel que só o admin abre — colaborador não gerencia acessos. */
const ADMIN_ONLY_HREFS = new Set(["/admin/acessos"]);

export function adminNavFor(role: Role): NavItem[] {
  return role === "admin"
    ? ADMIN_NAV
    : ADMIN_NAV.filter((item) => !ADMIN_ONLY_HREFS.has(item.href));
}

/** Logo oficial da CarNext. */
export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`${BASE}/carnext-logo.png`}
      srcSet={`${BASE}/carnext-logo.png 1x, ${BASE}/carnext-logo@2x.png 2x`}
      alt="CarNext"
      className={`${className} w-auto`}
    />
  );
}

function Wordmark() {
  return (
    <Link href="/" aria-label="CarNext — portal do investidor">
      <Logo className="h-10" />
    </Link>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/" || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Shell({
  nav,
  areaLabel,
  userName,
  userMeta,
  showRiskFooter,
  children,
}: {
  nav: NavItem[];
  areaLabel: string;
  userName: string;
  userMeta: string;
  /** Rodapé fixo de risco — obrigatório no portal do investidor. */
  showRiskFooter: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  const links = (
    <nav className="space-y-1" aria-label={areaLabel}>
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-brand-raised font-medium text-brand-white"
                : "text-brand-soft hover:bg-brand-raised/60 hover:text-brand-white"
            )}
          >
            <span className="shrink-0 text-brand-muted">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Barra móvel */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-brand-line bg-brand-black/95 px-4 py-3 backdrop-blur lg:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-lateral"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="rounded-lg p-2 text-brand-soft hover:bg-brand-raised"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Lateral */}
      <aside
        id="menu-lateral"
        className={cn(
          "border-brand-line bg-brand-surface lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r",
          open ? "block border-b" : "hidden lg:block"
        )}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="space-y-6">
            <div className="hidden px-2 pt-2 lg:block">
              <Wordmark />
              <p className="mt-1 text-[11px] uppercase tracking-wider text-brand-muted">
                {areaLabel}
              </p>
            </div>
            {links}
          </div>

          <div className="space-y-3 pt-6">
            <div className="rounded-xl border border-brand-line bg-brand-raised px-3 py-2.5">
              <p className="truncate text-sm font-medium text-brand-white">
                {userName}
              </p>
              <p className="truncate text-[11px] text-brand-muted">{userMeta}</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                clearSession();
                window.location.assign(`${BASE}/login/`);
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-brand-soft transition-colors hover:bg-brand-raised hover:text-brand-white"
              >
                <LogOut size={17} className="text-brand-muted" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        <DemoBanner />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        {showRiskFooter ? (
          <footer className="border-t border-brand-line bg-brand-surface px-4 py-4 sm:px-6 lg:px-8">
            <p className="mx-auto max-w-6xl text-[11px] leading-relaxed text-brand-muted">
              {PORTAL_FOOTER}
            </p>
          </footer>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Faixa permanente de demonstração.
 *
 * O portal fica sob um domínio real da empresa, mas todos os dados são
 * fictícios. Sem este aviso, um visitante poderia ler o histórico como
 * resultado real da operação — então ele é fixo, em todas as telas, e não
 * pode ser fechado.
 */
function DemoBanner() {
  return (
    <div className="border-b border-warn/30 bg-warn-dim px-4 py-2.5 sm:px-6 lg:px-8">
      <p className="mx-auto max-w-6xl text-[11px] font-medium leading-relaxed text-warn">
        AMBIENTE DE DEMONSTRAÇÃO — investidores, veículos, custos e resultados
        desta tela são fictícios e servem apenas para avaliar o produto. Não
        representam a carteira, o estoque nem o desempenho reais da CarNext.
      </p>
    </div>
  );
}

/* ──────────────────────────── Cabeçalho de página ──────────────────────── */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
