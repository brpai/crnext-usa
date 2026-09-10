"use client";

import * as React from "react";
import Link from "next/link";
import { Download, FileDown } from "lucide-react";
import type { MovementRow } from "@/lib/data/movements";
import type { MovementType } from "@/lib/types";
import { MOVEMENT_LABEL, date, money, moneySigned } from "@/lib/format";
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
  TotalRow,
  cn,
} from "@/components/ui";

const TYPES: MovementType[] = [
  "aporte",
  "alocacao",
  "devolucao",
  "distribuicao_lucro",
];

/** Sinal com que o movimento afeta o capital em custódia. */
function custodySign(type: MovementType): -1 | 0 | 1 {
  if (type === "alocacao") return -1;
  if (type === "distribuicao_lucro") return 0;
  return 1;
}

export function StatementTable({
  rows,
  vehicleNames,
}: {
  rows: MovementRow[];
  vehicleNames: Record<string, string>;
}) {
  const [type, setType] = React.useState<"todos" | MovementType>("todos");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const visible = React.useMemo(
    () =>
      rows.filter((r) => {
        if (type !== "todos" && r.type !== type) return false;
        if (from && r.date < from) return false;
        if (to && r.date > to) return false;
        return true;
      }),
    [rows, type, from, to]
  );

  const totals = React.useMemo(() => {
    const t = { aporte: 0, alocacao: 0, devolucao: 0, distribuicao_lucro: 0 };
    for (const r of visible) t[r.type] += r.amountCents;
    return t;
  }, [visible]);

  const closingBalance = visible.length
    ? visible[visible.length - 1].balanceCents
    : rows.length
      ? rows[rows.length - 1].balanceCents
      : 0;

  function exportCsv() {
    const header = [
      "data",
      "tipo",
      "veiculo",
      "valor_usd",
      "saldo_custodia_usd",
      "referencia_bancaria",
      "observacao",
    ];
    const lines = visible.map((r) =>
      [
        r.date,
        MOVEMENT_LABEL[r.type],
        r.vehicleId ? vehicleNames[r.vehicleId] ?? r.vehicleId : "",
        (r.amountCents / 100).toFixed(2),
        (r.balanceCents / 100).toFixed(2),
        r.bankReference,
        r.note,
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extrato-carnext-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-2xl">
        <Field label="Tipo de movimento" htmlFor="f-tipo">
          <Select
            id="f-tipo"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
          >
            <option value="todos">Todos</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {MOVEMENT_LABEL[t]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="De" htmlFor="f-de">
          <Input
            id="f-de"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </Field>
        <Field label="Até" htmlFor="f-ate">
          <Input
            id="f-ate"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </Field>
      </div>

      <Card>
        <CardHeader
          title="Movimentos"
          subtitle={`${visible.length} ${visible.length === 1 ? "registro" : "registros"} no filtro atual.`}
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={exportCsv} disabled={!visible.length}>
                <Download size={15} /> Exportar CSV
              </Button>
              {/* TODO(supabase/pdf): gerar PDF do extrato no servidor. */}
              <Button variant="ghost" disabled title="Disponível em breve">
                <FileDown size={15} /> PDF
              </Button>
            </div>
          }
        />
        <CardBody className="px-0 py-0">
          {visible.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Nenhum movimento neste filtro"
                description="Ajuste o tipo ou o período para ver os demais movimentos da sua posição."
              />
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Data</Th>
                  <Th>Movimento</Th>
                  <Th>Veículo</Th>
                  <Th>Referência</Th>
                  <Th align="right">Valor</Th>
                  <Th align="right">Saldo em custódia</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const sign = custodySign(r.type);
                  return (
                    <tr key={r.id}>
                      <Td>
                        <span className="tabular text-brand-soft">{date(r.date)}</span>
                      </Td>
                      <Td>
                        <span className="text-brand-white">
                          {MOVEMENT_LABEL[r.type]}
                        </span>
                        <p className="mt-0.5 max-w-sm text-[11px] leading-relaxed text-brand-muted">
                          {r.note}
                        </p>
                      </Td>
                      <Td>
                        {r.vehicleId ? (
                          <Link
                            href={`/veiculos/${r.vehicleId}`}
                            className="text-xs text-brand-soft underline decoration-brand-line underline-offset-4 hover:text-brand-white"
                          >
                            {vehicleNames[r.vehicleId] ?? r.vehicleId}
                          </Link>
                        ) : (
                          <span className="text-xs text-brand-muted">—</span>
                        )}
                      </Td>
                      <Td>
                        <span className="font-mono text-[11px] text-brand-muted">
                          {r.bankReference}
                        </span>
                      </Td>
                      <Td align="right">
                        <span
                          className={cn(
                            "tabular",
                            r.type === "distribuicao_lucro" && "text-gain",
                            sign === -1 && "text-brand-soft"
                          )}
                        >
                          {sign === 0
                            ? money(r.amountCents)
                            : moneySigned(sign * r.amountCents)}
                        </span>
                      </Td>
                      <Td align="right">
                        <span className="tabular text-brand-white">
                          {money(r.balanceCents)}
                        </span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <TotalRow>
                  <Td className="border-b-0">Totais do filtro</Td>
                  <Td className="border-b-0" colSpan={3}>
                    <span className="text-xs font-normal text-brand-muted">
                      Aportes {money(totals.aporte)} · Alocações{" "}
                      {money(totals.alocacao)} · Devoluções{" "}
                      {money(totals.devolucao)} · Lucro pago{" "}
                      {money(totals.distribuicao_lucro)}
                    </span>
                  </Td>
                  <Td align="right" className="border-b-0" />
                  <Td align="right" className="border-b-0">
                    {money(closingBalance)}
                  </Td>
                </TotalRow>
              </tfoot>
            </Table>
          )}
        </CardBody>
      </Card>

      <p className="mt-4 text-[11px] leading-relaxed text-brand-muted">
        O saldo em custódia é o capital aportado e ainda não alocado a veículos.
        Distribuições de lucro são pagas diretamente a você e por isso aparecem
        como movimento, mas não compõem esse saldo.
      </p>
    </>
  );
}
