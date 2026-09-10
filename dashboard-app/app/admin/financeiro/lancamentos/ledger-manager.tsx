"use client";

import * as React from "react";
import { Download, Plus } from "lucide-react";
import type {
  CostCenter,
  LedgerDirection,
  LedgerEntry,
  LedgerGroup,
  LedgerMethod,
  Vehicle,
} from "@/lib/types";
import {
  FINANCE_ACCOUNTS,
  FinanceError,
  LEDGER_CATEGORIES,
  accountName,
  cancelLedgerEntry,
  categoryCents,
  categoryLabel,
  createLedgerEntry,
  isOverdue,
  listLedgerEntries,
  markLedgerEntryPaid,
  reverseLedgerEntry,
  todayIso,
  type FinanceActor,
} from "@/lib/data/finance";
import { useSession } from "@/lib/hooks";
import {
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
  cn,
} from "@/components/ui";
import { Modal } from "@/components/modal";
import { BreakdownChart, ViewToggle, type ViewMode } from "@/components/charts";
import {
  COST_CENTER_LABEL,
  LEDGER_GROUP_LABEL,
  LEDGER_METHOD_LABEL,
  date,
  money,
  vehicleLabel,
} from "@/lib/format";
import { EntryStatusBadge, SMALL } from "../finance-ui";

type DirectionFilter = "todas" | LedgerDirection;
type StatusFilter = "todos" | "pago" | "pendente" | "atrasado" | "cancelado";
type RowAction = "estornar" | "baixar" | "cancelar";

const GROUPS = Object.keys(LEDGER_GROUP_LABEL) as LedgerGroup[];
const CENTERS = Object.keys(COST_CENTER_LABEL) as CostCenter[];
const METHODS = Object.keys(LEDGER_METHOD_LABEL) as LedgerMethod[];

export function LedgerManager({
  initialEntries,
  vehicles,
}: {
  initialEntries: LedgerEntry[];
  vehicles: Vehicle[];
}) {
  const session = useSession();
  const actor: FinanceActor = { name: session?.displayName ?? "Admin" };
  const today = todayIso();

  const [entries, setEntries] = React.useState(initialEntries);
  const [direction, setDirection] = React.useState<DirectionFilter>("todas");
  const [group, setGroup] = React.useState<"todos" | LedgerGroup>("todos");
  const [center, setCenter] = React.useState<"todos" | CostCenter>("todos");
  const [status, setStatus] = React.useState<StatusFilter>("todos");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [view, setView] = React.useState<ViewMode>("tabela");
  const [confirmKey, setConfirmKey] = React.useState<string | null>(null);
  const [rowError, setRowError] = React.useState<{ id: string; text: string } | null>(null);

  const vehicleNames = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const v of vehicles) map[v.id] = vehicleLabel(v);
    return map;
  }, [vehicles]);

  const visible = React.useMemo(
    () =>
      entries.filter((e) => {
        if (direction !== "todas" && e.direction !== direction) return false;
        if (group !== "todos" && e.group !== group) return false;
        if (center !== "todos" && e.costCenter !== center) return false;
        if (status === "atrasado" && !isOverdue(e, today)) return false;
        if (status !== "todos" && status !== "atrasado" && e.status !== status) return false;
        if (from && e.date < from) return false;
        if (to && e.date > to) return false;
        return true;
      }),
    [entries, direction, group, center, status, from, to, today]
  );

  const totals = React.useMemo(() => {
    let inCents = 0;
    let outCents = 0;
    for (const e of visible) {
      if (e.status !== "pago") continue;
      if (e.direction === "entrada") inCents += e.amountCents;
      else outCents += e.amountCents;
    }
    return { inCents, outCents };
  }, [visible]);

  const byCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const e of visible) {
      if (e.status !== "pago") continue;
      map.set(e.category, (map.get(e.category) ?? 0) + categoryCents(e));
    }
    return [...map.entries()].map(([key, cents]) => ({ key, label: categoryLabel(key), cents }));
  }, [visible]);

  async function refresh() {
    setEntries(await listLedgerEntries());
  }

  async function act(id: string, action: RowAction) {
    setRowError(null);
    try {
      if (action === "estornar") await reverseLedgerEntry(id, actor);
      else if (action === "baixar") await markLedgerEntryPaid(id, actor);
      else await cancelLedgerEntry(id, actor);
      await refresh();
    } catch (err) {
      setRowError({ id, text: err instanceof FinanceError ? err.message : "Não foi possível concluir." });
    } finally {
      setConfirmKey(null);
    }
  }

  function exportCsv() {
    const header = [
      "data", "tipo", "grupo", "categoria", "centro_de_custo", "descricao", "valor_usd",
      "conta", "forma", "contraparte", "veiculo", "status", "vencimento", "pago_em", "estorno_de",
    ];
    const lines = visible.map((e) =>
      [
        e.date,
        e.direction,
        LEDGER_GROUP_LABEL[e.group],
        categoryLabel(e.category),
        COST_CENTER_LABEL[e.costCenter],
        e.description,
        (e.amountCents / 100).toFixed(2),
        accountName(e.accountId),
        LEDGER_METHOD_LABEL[e.method],
        e.counterparty,
        e.vehicleId ? vehicleNames[e.vehicleId] ?? e.vehicleId : "",
        e.status,
        e.dueDate ?? "",
        e.paidAt ?? "",
        e.reversalOf ?? "",
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financeiro-carnext-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <Field label="Tipo" htmlFor="l-tipo">
          <Select id="l-tipo" value={direction} onChange={(e) => setDirection(e.target.value as DirectionFilter)}>
            <option value="todas">Entradas e saídas</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </Select>
        </Field>
        <Field label="Grupo" htmlFor="l-grupo">
          <Select id="l-grupo" value={group} onChange={(e) => setGroup(e.target.value as typeof group)}>
            <option value="todos">Todos</option>
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                {LEDGER_GROUP_LABEL[g]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Centro de custo" htmlFor="l-centro">
          <Select id="l-centro" value={center} onChange={(e) => setCenter(e.target.value as typeof center)}>
            <option value="todos">Todos</option>
            {CENTERS.map((c) => (
              <option key={c} value={c}>
                {COST_CENTER_LABEL[c]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" htmlFor="l-status">
          <Select id="l-status" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
            <option value="todos">Todos</option>
            <option value="pago">Pagos e recebidos</option>
            <option value="pendente">Pendentes</option>
            <option value="atrasado">Atrasados</option>
            <option value="cancelado">Cancelados</option>
          </Select>
        </Field>
        <Field label="De" htmlFor="l-de">
          <Input id="l-de" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Até" htmlFor="l-ate">
          <Input id="l-ate" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
      </div>

      <Card>
        <CardHeader
          title="Lançamentos"
          subtitle={`${visible.length} no filtro · recebido ${money(totals.inCents)} · pago ${money(totals.outCents)}`}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <ViewToggle value={view} onChange={setView} />
              <Button variant="secondary" onClick={exportCsv} disabled={!visible.length}>
                <Download size={15} /> CSV
              </Button>
              <NewEntryDialog vehicles={vehicles} actor={actor} onCreated={refresh} />
            </div>
          }
        />
        <CardBody className="px-0 py-0">
          {view === "grafico" && visible.length > 0 ? (
            <div className="p-5">
              <p className="mb-3 text-xs text-brand-muted">
                Valores pagos e recebidos no filtro atual, por categoria. Estornos já descontados.
              </p>
              <BreakdownChart
                items={byCategory}
                seriesName="Valor"
                emptyText="Nenhum valor pago ou recebido no filtro atual."
              />
            </div>
          ) : visible.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Nenhum lançamento neste filtro"
                description="Ajuste os filtros ou registre um novo lançamento."
              />
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Data</Th>
                  <Th>Lançamento</Th>
                  <Th>Conta</Th>
                  <Th>Status</Th>
                  <Th align="right">Valor</Th>
                  <Th align="right">Ações</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((e) => {
                  const overdue = isOverdue(e, today);
                  const canReverse = e.status === "pago" && !e.reversalOf && !e.reversedBy;
                  return (
                    <tr key={e.id}>
                      <Td>
                        <span className="tabular whitespace-nowrap text-xs text-brand-soft">{date(e.date)}</span>
                      </Td>
                      <Td>
                        <span className={cn("text-brand-white", e.status === "cancelado" && "text-brand-muted line-through")}>
                          {e.description}
                        </span>
                        <p className="mt-0.5 text-[11px] text-brand-muted">
                          {[
                            categoryLabel(e.category) !== e.description ? categoryLabel(e.category) : null,
                            LEDGER_GROUP_LABEL[e.group],
                            COST_CENTER_LABEL[e.costCenter],
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <p className="text-[11px] text-brand-muted">
                          {e.counterparty}
                          {e.vehicleId ? ` · ${vehicleNames[e.vehicleId] ?? e.vehicleId}` : ""}
                        </p>
                      </Td>
                      <Td>
                        <span className="text-xs text-brand-soft">{accountName(e.accountId)}</span>
                        <p className="text-[11px] text-brand-muted">
                          {LEDGER_METHOD_LABEL[e.method]}
                          {e.receiptUrl ? " · comprovante" : ""}
                        </p>
                      </Td>
                      <Td>
                        <EntryStatusBadge entry={e} overdue={overdue} />
                        {e.status === "pendente" && e.dueDate ? (
                          <p className="mt-1 tabular text-[11px] text-brand-muted">Vence {date(e.dueDate)}</p>
                        ) : null}
                        {e.reversalOf ? <p className="mt-1 text-[11px] text-brand-muted">Estorno</p> : null}
                        {e.reversedBy ? <p className="mt-1 text-[11px] text-brand-muted">Estornado</p> : null}
                      </Td>
                      <Td align="right">
                        <span
                          className={cn(
                            "tabular whitespace-nowrap",
                            e.direction === "entrada" ? "text-gain" : "text-brand-white",
                            e.status === "cancelado" && "text-brand-muted line-through"
                          )}
                        >
                          {e.direction === "entrada" ? "+" : "−"}
                          {money(e.amountCents)}
                        </span>
                      </Td>
                      <Td align="right">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {e.status === "pendente" ? (
                            confirmKey === `cancelar:${e.id}` ? (
                              <>
                                <Button variant="danger" className={SMALL} onClick={() => act(e.id, "cancelar")}>
                                  Confirmar cancelamento
                                </Button>
                                <Button variant="ghost" className={SMALL} onClick={() => setConfirmKey(null)}>
                                  Voltar
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button variant="secondary" className={SMALL} onClick={() => act(e.id, "baixar")}>
                                  {e.direction === "entrada" ? "Receber" : "Pagar"}
                                </Button>
                                <Button variant="ghost" className={SMALL} onClick={() => setConfirmKey(`cancelar:${e.id}`)}>
                                  Cancelar
                                </Button>
                              </>
                            )
                          ) : canReverse ? (
                            confirmKey === `estornar:${e.id}` ? (
                              <>
                                <Button variant="danger" className={SMALL} onClick={() => act(e.id, "estornar")}>
                                  Confirmar estorno
                                </Button>
                                <Button variant="ghost" className={SMALL} onClick={() => setConfirmKey(null)}>
                                  Voltar
                                </Button>
                              </>
                            ) : (
                              <Button variant="secondary" className={SMALL} onClick={() => setConfirmKey(`estornar:${e.id}`)}>
                                Estornar
                              </Button>
                            )
                          ) : (
                            <span className="text-xs text-brand-muted">—</span>
                          )}
                        </div>
                        {rowError?.id === e.id ? (
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
    </>
  );
}

/* ────────────────────────────── Novo lançamento ─────────────────────────── */

function NewEntryDialog({
  vehicles,
  actor,
  onCreated,
}: {
  vehicles: Vehicle[];
  actor: FinanceActor;
  onCreated: () => Promise<void>;
}) {
  const first = (d: LedgerDirection) => LEDGER_CATEGORIES.find((c) => c.direction === d)!;

  const [open, setOpen] = React.useState(false);
  const [direction, setDirection] = React.useState<LedgerDirection>("saida");
  const [category, setCategory] = React.useState(first("saida").key);
  const [costCenter, setCostCenter] = React.useState<CostCenter>(first("saida").costCenter);
  const [status, setStatus] = React.useState<"pago" | "pendente">("pago");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [entryDate, setEntryDate] = React.useState(todayIso());
  const [dueDate, setDueDate] = React.useState("");
  const [accountId, setAccountId] = React.useState(FINANCE_ACCOUNTS[0].id);
  const [method, setMethod] = React.useState<LedgerMethod>("ach");
  const [counterparty, setCounterparty] = React.useState("");
  const [vehicleId, setVehicleId] = React.useState("");
  const [hasReceipt, setHasReceipt] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const categories = LEDGER_CATEGORIES.filter((c) => c.direction === direction);
  const current = LEDGER_CATEGORIES.find((c) => c.key === category);
  const showVehicle = current?.group === "custo_veiculo" || category === "venda_veiculo";

  function changeDirection(d: LedgerDirection) {
    setDirection(d);
    setCategory(first(d).key);
    setCostCenter(first(d).costCenter);
  }

  function changeCategory(key: string) {
    setCategory(key);
    const c = LEDGER_CATEGORIES.find((x) => x.key === key);
    if (c) setCostCenter(c.costCenter);
  }

  function reset() {
    setDescription("");
    setAmount("");
    setDueDate("");
    setCounterparty("");
    setVehicleId("");
    setHasReceipt(false);
    setError(null);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const cents = Math.round(Number(amount) * 100);
      await createLedgerEntry(
        {
          direction,
          category,
          costCenter,
          description,
          amountCents: Number.isFinite(cents) ? cents : 0,
          date: entryDate,
          accountId,
          method,
          counterparty,
          vehicleId: showVehicle && vehicleId ? vehicleId : null,
          status,
          dueDate: status === "pendente" ? dueDate || null : null,
          hasReceipt,
        },
        actor
      );
      await onCreated();
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof FinanceError ? err.message : "Não foi possível salvar o lançamento.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      width={520}
      title="Novo lançamento"
      description="Entrada ou saída da empresa. Fica registrado na auditoria com o seu nome."
      trigger={
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-white px-4 py-2.5 text-sm font-medium text-brand-black transition-colors hover:bg-brand-deep"
        >
          <Plus size={15} /> Novo lançamento
        </button>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo" htmlFor="n-tipo">
            <Select id="n-tipo" value={direction} onChange={(e) => changeDirection(e.target.value as LedgerDirection)}>
              <option value="saida">Saída</option>
              <option value="entrada">Entrada</option>
            </Select>
          </Field>
          <Field label="Status" htmlFor="n-status">
            <Select id="n-status" value={status} onChange={(e) => setStatus(e.target.value as "pago" | "pendente")}>
              <option value="pago">{direction === "entrada" ? "Recebido" : "Pago"}</option>
              <option value="pendente">{direction === "entrada" ? "A receber" : "A pagar"}</option>
            </Select>
          </Field>
        </div>

        <Field
          label="Categoria"
          htmlFor="n-cat"
          hint={
            current
              ? `${LEDGER_GROUP_LABEL[current.group]}${current.group === "capital_investidor" ? " — fica fora do resultado da empresa." : "."}`
              : undefined
          }
        >
          <Select id="n-cat" value={category} onChange={(e) => changeCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Descrição" htmlFor="n-desc">
          <Input id="n-desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor (US$)" htmlFor="n-valor">
            <Input
              id="n-valor"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Field>
          <Field label={status === "pendente" ? "Data de emissão" : "Data"} htmlFor="n-data">
            <Input id="n-data" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
          </Field>
        </div>

        {status === "pendente" ? (
          <Field label="Vencimento" htmlFor="n-venc">
            <Input id="n-venc" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </Field>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Conta" htmlFor="n-conta">
            <Select id="n-conta" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {FINANCE_ACCOUNTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Forma de pagamento" htmlFor="n-forma">
            <Select id="n-forma" value={method} onChange={(e) => setMethod(e.target.value as LedgerMethod)}>
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {LEDGER_METHOD_LABEL[m]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Centro de custo" htmlFor="n-centro">
            <Select id="n-centro" value={costCenter} onChange={(e) => setCostCenter(e.target.value as CostCenter)}>
              {CENTERS.map((c) => (
                <option key={c} value={c}>
                  {COST_CENTER_LABEL[c]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={direction === "entrada" ? "Cliente ou origem" : "Fornecedor"} htmlFor="n-contra">
            <Input id="n-contra" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} />
          </Field>
        </div>

        {showVehicle ? (
          <Field label="Veículo" htmlFor="n-veic">
            <Select id="n-veic" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
              <option value="">Sem veículo vinculado</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {vehicleLabel(v)} · VIN …{v.vin.slice(-6)}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}

        <Field
          label="Comprovante"
          htmlFor="n-comp"
          hint="No protótipo o arquivo não é enviado. Com o Supabase, vai para armazenamento privado."
        >
          <Input
            id="n-comp"
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setHasReceipt(Boolean(e.target.files?.length))}
          />
        </Field>

        {error ? (
          <p role="alert" className="text-xs text-loss">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Salvando…" : "Salvar lançamento"}
        </Button>
      </form>
    </Modal>
  );
}
