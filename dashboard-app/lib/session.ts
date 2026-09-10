"use client";

import type { SessionUser } from "./types";
import { findActiveGrantSync, grantToSession } from "./data/access";

/**
 * Sessão SIMULADA, client-side, por cookie.
 *
 * O cookie guarda só o e-mail com que a pessoa entrou. Papel e vínculo são
 * relidos da lista de acessos a cada leitura — assim um acesso revogado deixa
 * de valer na hora, e ninguém escolhe o próprio papel.
 *
 * TODO(supabase): trocar por Supabase Auth.
 *   · `readSession()`  → supabase.auth.getSession() + o próprio `access_grants`;
 *   · `writeSession()` → desnecessário (verifyOtp já grava a sessão);
 *   · `clearSession()` → supabase.auth.signOut();
 *   A proteção REAL dos dados é RLS no Postgres, nunca este arquivo.
 */

export const ROLE_KEY = "cnx_role";
/** Lido também pelo portão inline de `app/layout.tsx` — manter o nome igual. */
export const EMAIL_KEY = "cnx_email";
/** Cookie do antigo seletor de perfil; hoje só é apagado. */
const LEGACY_INVESTOR_KEY = "cnx_investor";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

function dropCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function readSession(): SessionUser | null {
  const email = readCookie(EMAIL_KEY);
  if (!email) return null;

  const grant = findActiveGrantSync(email);
  if (!grant) {
    clearSession();
    return null;
  }
  return grantToSession(grant);
}

export function writeSession(user: SessionUser) {
  writeCookie(ROLE_KEY, user.role);
  writeCookie(EMAIL_KEY, user.email);
}

export function clearSession() {
  dropCookie(ROLE_KEY);
  dropCookie(EMAIL_KEY);
  dropCookie(LEGACY_INVESTOR_KEY);
}
