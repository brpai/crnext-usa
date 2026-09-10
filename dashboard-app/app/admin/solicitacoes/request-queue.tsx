"use client";

import * as React from "react";
import { Inbox } from "lucide-react";
import type { CapitalRequest } from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Textarea,
} from "@/components/ui";
import { METHOD_LABEL, REQUEST_STATUS_LABEL, dateTime, money } from "@/lib/format";

/** TODO(supabase): update de status + resposta em `capital_requests`. */
export function RequestQueue({
  requests,
  investorNames,
}: {
  requests: CapitalRequest[];
  investorNames: Record<string, string>;
}) {
  const [list, setList] = React.useState(requests);
  const [draft, setDraft] = React.useState<Record<string, string>>({});

  function respond(id: string, status: "aprovado" | "recusado") {
    const now = new Date().toISOString();
    setList((l) =>
      l.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              respondedAt: now,
              adminResponse: draft[id] || r.adminResponse,
            }
          : r
      )
    );
    setDraft((d) => ({ ...d, [id]: "" }));
  }

  if (!list.length) {
    return (
      <EmptyState
        icon={<Inbox size={26} />}
        title="Nenhuma solicitação"
        description="Quando um investidor enviar uma solicitação de aporte, ela entra nesta fila."
      />
    );
  }

  return (
    <div className="space-y-5">
      {list.map((r) => {
        const open = r.status === "pendente" || r.status === "em_analise";
        return (
          <Card key={r.id}>
            <CardHeader
              title={investorNames[r.investorId] ?? r.investorId}
              subtitle={`${money(r.amountCents)} via ${METHOD_LABEL[r.method]} · enviada em ${dateTime(r.createdAt)}`}
              action={
                <Badge
                  tone={
                    r.status === "aprovado"
                      ? "ok"
                      : r.status === "recusado"
                        ? "critico"
                        : "atencao"
                  }
                >
                  {REQUEST_STATUS_LABEL[r.status]}
                </Badge>
              }
            />
            <CardBody className="space-y-4">
              {r.message ? (
                <p className="rounded-xl border border-brand-line bg-brand-raised px-4 py-3 text-sm leading-relaxed text-brand-soft">
                  “{r.message}”
                </p>
              ) : null}

              {r.adminResponse ? (
                <div>
                  <p className="text-xs font-medium text-brand-white">Resposta</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-soft">
                    {r.adminResponse}
                  </p>
                  {r.respondedAt ? (
                    <p className="mt-1 text-[11px] text-brand-muted">
                      Respondida em {dateTime(r.respondedAt)}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {open ? (
                <div className="space-y-3">
                  <label
                    htmlFor={`resp-${r.id}`}
                    className="block text-xs font-medium text-brand-soft"
                  >
                    Resposta ao investidor
                  </label>
                  <Textarea
                    id={`resp-${r.id}`}
                    value={draft[r.id] ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [r.id]: e.target.value }))
                    }
                    placeholder="Confirme os dados para envio, ou explique o motivo da recusa."
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => respond(r.id, "aprovado")}>
                      Aprovar
                    </Button>
                    <Button variant="danger" onClick={() => respond(r.id, "recusado")}>
                      Recusar
                    </Button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-brand-muted">
                    Aprovar registra a intenção de aporte. O capital só entra na
                    posição do investidor quando os recursos forem confirmados.
                  </p>
                </div>
              ) : null}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
