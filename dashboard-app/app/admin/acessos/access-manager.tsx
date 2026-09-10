"use client";

import * as React from "react";
import { KeyRound, UserPlus } from "lucide-react";
import type { AccessGrant, Investor, Role } from "@/lib/types";
import {
  AccessError,
  IS_PROTOTYPE,
  createAccessGrant,
  listAccessGrants,
  reactivateAccessGrant,
  revokeAccessGrant,
  type AccessActor,
} from "@/lib/data/access";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Field,
  Input,
  Select,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { ROLE_LABEL, dateTime } from "@/lib/format";

const ROLE_HINT: Record<Role, string> = {
  investidor:
    "Vê somente a própria carteira: veículos, extrato, contratos, aporte e suporte.",
  colaborador:
    "Opera o painel administrativo, mas não cria nem revoga acessos.",
  admin: "Acesso total ao painel, inclusive a esta tela de acessos.",
};

const SMALL = "px-3 py-1.5 text-xs";

function message(err: unknown, fallback: string): string {
  return err instanceof AccessError ? err.message : fallback;
}

export function AccessManager({
  initialGrants,
  investors,
  actor,
}: {
  initialGrants: AccessGrant[];
  investors: Investor[];
  actor: AccessActor;
}) {
  const [grants, setGrants] = React.useState(initialGrants);
  const [role, setRole] = React.useState<Role>("investidor");
  const [investorId, setInvestorId] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [created, setCreated] = React.useState<AccessGrant | null>(null);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [rowError, setRowError] = React.useState<{ id: string; text: string } | null>(
    null
  );

  const investorName = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const i of investors) map[i.id] = i.name;
    return map;
  }, [investors]);

  const activeCount = grants.filter((g) => g.status === "ativo").length;

  async function refresh() {
    setGrants(await listAccessGrants());
  }

  /** Ao escolher o investidor, sugere nome e e-mail do cadastro dele. */
  function pickInvestor(id: string) {
    setInvestorId(id);
    const inv = investors.find((i) => i.id === id);
    if (!inv) return;
    if (!name.trim()) setName(inv.name);
    if (!email.trim()) setEmail(inv.email);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setCreated(null);
    setBusy(true);
    try {
      const grant = await createAccessGrant(
        {
          name,
          email,
          role,
          investorId: role === "investidor" ? investorId || null : null,
        },
        actor
      );
      setCreated(grant);
      setName("");
      setEmail("");
      setInvestorId("");
      await refresh();
    } catch (err) {
      setFormError(message(err, "Não foi possível autorizar o acesso."));
    } finally {
      setBusy(false);
    }
  }

  async function act(id: string, kind: "revogar" | "reativar") {
    setRowError(null);
    try {
      if (kind === "revogar") await revokeAccessGrant(id, actor);
      else await reactivateAccessGrant(id, actor);
      await refresh();
    } catch (err) {
      setRowError({ id, text: message(err, "Não foi possível concluir.") });
    } finally {
      setConfirmId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Autorizar novo acesso"
          subtitle="A pessoa só consegue entrar depois de cadastrada aqui, e com o papel definido aqui."
        />
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Papel" htmlFor="acc-role" hint={ROLE_HINT[role]}>
                <Select
                  id="acc-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="investidor">Investidor</option>
                  <option value="colaborador">Colaborador</option>
                  <option value="admin">Admin</option>
                </Select>
              </Field>

              {role === "investidor" ? (
                <Field
                  label="Investidor vinculado"
                  htmlFor="acc-investor"
                  hint="O investidor precisa estar no cadastro de Investidores."
                >
                  <Select
                    id="acc-investor"
                    value={investorId}
                    onChange={(e) => pickInvestor(e.target.value)}
                    required
                  >
                    <option value="">Selecione…</option>
                    {investors.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                        {i.status === "inativo" ? " (inativo)" : ""}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : (
                <div className="hidden sm:block" />
              )}

              <Field label="Nome" htmlFor="acc-name">
                <Input
                  id="acc-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  required
                />
              </Field>

              <Field label="E-mail" htmlFor="acc-email">
                <Input
                  id="acc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </Field>
            </div>

            {formError ? (
              <p role="alert" className="text-xs text-loss">
                {formError}
              </p>
            ) : null}

            {created ? (
              <div
                role="status"
                className="rounded-xl border border-gain/25 bg-gain-dim px-4 py-3 text-xs leading-relaxed text-gain"
              >
                <p className="font-medium">
                  Acesso autorizado para {created.email} ({ROLE_LABEL[created.role]}).
                </p>
                <p className="mt-1">
                  Envie à pessoa o endereço carnextusa.com/dashboard. Ela entra com
                  este e-mail e recebe um código de acesso.
                  {IS_PROTOTYPE
                    ? " No protótipo nenhum e-mail é enviado e o acesso vale só neste navegador."
                    : ""}
                </p>
              </div>
            ) : null}

            <Button type="submit" disabled={busy}>
              <UserPlus size={16} />
              {busy ? "Autorizando…" : "Autorizar acesso"}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Pessoas com acesso"
          subtitle={`${activeCount} ativos · ${grants.length - activeCount} revogados. Revogar corta o acesso na próxima tela que a pessoa abrir.`}
        />
        <CardBody className="px-0 py-0">
          {grants.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={<KeyRound size={26} />}
                title="Nenhum acesso cadastrado"
                description="Autorize o primeiro e-mail no formulário acima."
              />
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Pessoa</Th>
                  <Th>Papel</Th>
                  <Th>Status</Th>
                  <Th>Autorizado</Th>
                  <Th>Último acesso</Th>
                  <Th align="right">Ações</Th>
                </tr>
              </thead>
              <tbody>
                {grants.map((g) => {
                  const isSelf = g.email === actor.email;
                  return (
                    <tr key={g.id}>
                      <Td>
                        <span className="text-brand-white">{g.name}</span>
                        {isSelf ? (
                          <span className="ml-2 text-[11px] text-brand-muted">(você)</span>
                        ) : null}
                        <p className="text-xs text-brand-soft">{g.email}</p>
                      </Td>
                      <Td>
                        <Badge tone={g.role === "admin" ? "info" : "neutral"}>
                          {ROLE_LABEL[g.role]}
                        </Badge>
                        {g.role === "investidor" && g.investorId ? (
                          <p className="mt-1 text-[11px] text-brand-muted">
                            {investorName[g.investorId] ?? g.investorId}
                          </p>
                        ) : null}
                      </Td>
                      <Td>
                        <Badge tone={g.status === "ativo" ? "ok" : "critico"}>
                          {g.status === "ativo" ? "Ativo" : "Revogado"}
                        </Badge>
                        {g.status === "revogado" && g.revokedAt ? (
                          <p className="mt-1 text-[11px] text-brand-muted">
                            {dateTime(g.revokedAt)} por {g.revokedBy}
                          </p>
                        ) : null}
                      </Td>
                      <Td>
                        <span className="tabular whitespace-nowrap text-xs text-brand-soft">
                          {dateTime(g.createdAt)}
                        </span>
                        <p className="text-[11px] text-brand-muted">por {g.createdBy}</p>
                      </Td>
                      <Td>
                        <span className="tabular whitespace-nowrap text-xs text-brand-soft">
                          {g.lastLoginAt ? dateTime(g.lastLoginAt) : "Nunca entrou"}
                        </span>
                      </Td>
                      <Td align="right">
                        <div className="flex flex-wrap justify-end gap-2">
                          {g.status === "revogado" ? (
                            <Button
                              variant="secondary"
                              className={SMALL}
                              onClick={() => act(g.id, "reativar")}
                            >
                              Reativar
                            </Button>
                          ) : confirmId === g.id ? (
                            <>
                              <Button
                                variant="danger"
                                className={SMALL}
                                onClick={() => act(g.id, "revogar")}
                              >
                                Confirmar revogação
                              </Button>
                              <Button
                                variant="ghost"
                                className={SMALL}
                                onClick={() => setConfirmId(null)}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="secondary"
                              className={SMALL}
                              disabled={isSelf}
                              title={isSelf ? "Você não pode revogar o próprio acesso." : undefined}
                              onClick={() => {
                                setRowError(null);
                                setConfirmId(g.id);
                              }}
                            >
                              Revogar
                            </Button>
                          )}
                        </div>
                        {rowError?.id === g.id ? (
                          <p role="alert" className="mt-1.5 text-[11px] text-loss">
                            {rowError.text}
                          </p>
                        ) : null}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
