import type { AccessGrant, AuditEvent, Role, SessionUser } from "../types";
import { ROLE_LABEL } from "../format";
import { DEMO_LOGIN_CODE, MOCK_ACCESS_GRANTS } from "./mock/access";

/**
 * Lista de e-mails autorizados a entrar no portal.
 *
 * Regra do produto: ninguém cria conta sozinho. Um admin cadastra o e-mail na
 * tela Acessos; só então a pessoa consegue entrar, e com o papel que o admin
 * definiu.
 *
 * PROTÓTIPO: a lista vive no localStorage DESTE navegador, semeada com
 * `MOCK_ACCESS_GRANTS`. Um acesso criado aqui não vale em outro aparelho, e
 * nenhum e-mail é enviado — o código aceito é `DEMO_LOGIN_CODE`.
 *
 * TODO(supabase): tabela `access_grants` (README, seção 5.1). A barreira real
 * fica no banco: trigger em `auth.users` recusa e-mail sem acesso ativo, e a
 * RLS só entrega dados a quem tem acesso ativo. As funções abaixo viram
 * consultas; as assinaturas não mudam.
 */

export const IS_PROTOTYPE = true;
export { DEMO_LOGIN_CODE };

const GRANTS_KEY = "cnx_access_grants_v1";
const AUDIT_KEY = "cnx_access_audit_v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Erro de regra de negócio, com mensagem pronta para a tela. */
export class AccessError extends Error {}

/** Quem executa a ação — gravado na auditoria. */
export interface AccessActor {
  email: string;
  name: string;
}

export interface NewAccessInput {
  name: string;
  email: string;
  role: Role;
  investorId: string | null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/* ─────────────────────────── Armazenamento local ────────────────────────── */

let memoryGrants: AccessGrant[] | null = null;
let memoryAudit: AuditEvent[] = [];

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = storage()?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    storage()?.setItem(key, JSON.stringify(value));
  } catch {
    /* sem storage (aba privada): fica só em memória */
  }
}

function loadGrants(): AccessGrant[] {
  return read(GRANTS_KEY, memoryGrants ?? MOCK_ACCESS_GRANTS.map((g) => ({ ...g })));
}

function saveGrants(grants: AccessGrant[]) {
  memoryGrants = grants;
  write(GRANTS_KEY, grants);
}

function audit(actor: AccessActor, action: string, grant: AccessGrant) {
  const event: AuditEvent = {
    id: `aud-acc-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    actor: actor.name,
    action,
    entity: "AccessGrant",
    entityId: grant.id,
    detail: `${grant.email} — ${ROLE_LABEL[grant.role]}`,
  };
  memoryAudit = [event, ...read(AUDIT_KEY, memoryAudit)];
  write(AUDIT_KEY, memoryAudit);
}

/* ──────────────────────────────── Leitura ───────────────────────────────── */

/** Síncrono: a sessão usa para cortar na hora um acesso revogado. */
export function findActiveGrantSync(email: string): AccessGrant | null {
  const e = normalizeEmail(email);
  return loadGrants().find((g) => g.email === e && g.status === "ativo") ?? null;
}

export function grantToSession(grant: AccessGrant): SessionUser {
  return {
    role: grant.role,
    investorId: grant.role === "investidor" ? grant.investorId : null,
    displayName: grant.name,
    email: grant.email,
  };
}

/** Ativos primeiro, depois revogados; cada grupo por nome. */
export async function listAccessGrants(): Promise<AccessGrant[]> {
  return loadGrants().sort((a, b) =>
    a.status === b.status
      ? a.name.localeCompare(b.name, "pt-BR")
      : a.status === "ativo"
        ? -1
        : 1
  );
}

export async function listAccessAuditEvents(): Promise<AuditEvent[]> {
  return read(AUDIT_KEY, memoryAudit);
}

/* ──────────────────────────────── Escrita ───────────────────────────────── */

/** TODO(supabase): insert em `access_grants` (RLS: somente admin). */
export async function createAccessGrant(
  input: NewAccessInput,
  actor: AccessActor
): Promise<AccessGrant> {
  const email = normalizeEmail(input.email);
  const name = input.name.trim();
  if (!name) throw new AccessError("Informe o nome da pessoa.");
  if (!EMAIL_RE.test(email)) throw new AccessError("E-mail inválido.");
  if (input.role === "investidor" && !input.investorId)
    throw new AccessError("Escolha a qual investidor este acesso pertence.");

  const grants = loadGrants();
  if (grants.some((g) => g.email === email && g.status === "ativo"))
    throw new AccessError("Este e-mail já tem acesso ativo.");

  const grant: AccessGrant = {
    id: `acc-${Date.now().toString(36)}`,
    email,
    name,
    role: input.role,
    investorId: input.role === "investidor" ? input.investorId : null,
    status: "ativo",
    createdAt: new Date().toISOString(),
    createdBy: actor.name,
    revokedAt: null,
    revokedBy: null,
    lastLoginAt: null,
  };
  saveGrants([...grants, grant]);
  audit(actor, "autorizou acesso", grant);
  return grant;
}

/**
 * Revoga um acesso. Não deixa o admin se trancar para fora: não revoga o
 * próprio acesso nem o último admin ativo.
 *
 * TODO(supabase): update em `access_grants`; o trigger apaga o usuário em
 * `auth.users`, derrubando sessão e impedindo novo código.
 */
export async function revokeAccessGrant(
  id: string,
  actor: AccessActor
): Promise<AccessGrant> {
  const grants = loadGrants();
  const grant = grants.find((g) => g.id === id);
  if (!grant || grant.status !== "ativo")
    throw new AccessError("Este acesso não está ativo.");
  if (grant.email === normalizeEmail(actor.email))
    throw new AccessError("Você não pode revogar o próprio acesso.");
  const activeAdmins = grants.filter(
    (g) => g.role === "admin" && g.status === "ativo"
  ).length;
  if (grant.role === "admin" && activeAdmins <= 1)
    throw new AccessError(
      "É o último admin ativo. Autorize outro admin antes de revogar."
    );

  const updated: AccessGrant = {
    ...grant,
    status: "revogado",
    revokedAt: new Date().toISOString(),
    revokedBy: actor.name,
  };
  saveGrants(grants.map((g) => (g.id === id ? updated : g)));
  audit(actor, "revogou acesso", updated);
  return updated;
}

/** TODO(supabase): update em `access_grants` (RLS: somente admin). */
export async function reactivateAccessGrant(
  id: string,
  actor: AccessActor
): Promise<AccessGrant> {
  const grants = loadGrants();
  const grant = grants.find((g) => g.id === id);
  if (!grant || grant.status !== "revogado")
    throw new AccessError("Este acesso não está revogado.");
  if (grants.some((g) => g.email === grant.email && g.status === "ativo"))
    throw new AccessError("Este e-mail já tem outro acesso ativo.");

  const updated: AccessGrant = {
    ...grant,
    status: "ativo",
    revokedAt: null,
    revokedBy: null,
  };
  saveGrants(grants.map((g) => (g.id === id ? updated : g)));
  audit(actor, "reativou acesso", updated);
  return updated;
}

/* ───────────────────────────────── Login ────────────────────────────────── */

/**
 * Pede o código de login. A resposta é a mesma para e-mail autorizado ou não:
 * a tela nunca revela quem tem acesso.
 *
 * TODO(supabase): supabase.auth.signInWithOtp({ email, options: {
 * shouldCreateUser: true } }). E-mail sem acesso ativo é recusado pelo trigger
 * em `auth.users` — engolir esse erro aqui para manter a resposta idêntica.
 */
export async function requestLoginCode(email: string): Promise<void> {
  if (!EMAIL_RE.test(normalizeEmail(email)))
    throw new AccessError("E-mail inválido.");
}

/**
 * Confere o código. Devolve a sessão apenas se o e-mail tiver acesso ativo.
 *
 * TODO(supabase): supabase.auth.verifyOtp({ email, token, type: "email" }) e
 * depois ler o próprio acesso em `access_grants` (RLS: leitura da própria
 * linha). Sem linha ativa → signOut.
 */
export async function verifyLoginCode(
  email: string,
  code: string
): Promise<SessionUser | null> {
  const grant = findActiveGrantSync(email);
  if (!grant || code.trim() !== DEMO_LOGIN_CODE) return null;
  const now = new Date().toISOString();
  saveGrants(
    loadGrants().map((g) => (g.id === grant.id ? { ...g, lastLoginAt: now } : g))
  );
  return grantToSession(grant);
}
