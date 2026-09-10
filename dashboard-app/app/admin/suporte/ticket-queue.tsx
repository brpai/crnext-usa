"use client";

import * as React from "react";
import { LifeBuoy } from "lucide-react";
import type { SupportTicket } from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Textarea,
} from "@/components/ui";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_STATUS_LABEL,
  dateTime,
} from "@/lib/format";

/** TODO(supabase): insert em ticket_messages + update de status. */
export function TicketQueue({
  tickets,
  investorNames,
}: {
  tickets: SupportTicket[];
  investorNames: Record<string, string>;
}) {
  const [list, setList] = React.useState(tickets);
  const [draft, setDraft] = React.useState<Record<string, string>>({});

  function reply(id: string, resolve: boolean) {
    const body = (draft[id] ?? "").trim();
    if (!body) return;
    const now = new Date().toISOString();
    setList((l) =>
      l.map((t) =>
        t.id === id
          ? {
              ...t,
              status: resolve ? "resolvido" : "em_andamento",
              updatedAt: now,
              messages: [
                ...t.messages,
                {
                  id: `msg-admin-${Date.now()}`,
                  author: "carnext",
                  authorName: "CarNext",
                  body,
                  createdAt: now,
                },
              ],
            }
          : t
      )
    );
    setDraft((d) => ({ ...d, [id]: "" }));
  }

  if (!list.length) {
    return (
      <EmptyState
        icon={<LifeBuoy size={26} />}
        title="Nenhum ticket"
        description="Os tickets abertos pelos investidores aparecem nesta fila."
      />
    );
  }

  return (
    <div className="space-y-5">
      {list.map((t) => (
        <Card key={t.id}>
          <CardHeader
            title={t.subject}
            subtitle={`${investorNames[t.investorId] ?? t.investorId} · ${TICKET_CATEGORY_LABEL[t.category]} · atualizado em ${dateTime(t.updatedAt)}`}
            action={
              <div className="flex gap-2">
                {t.priority === "alta" ? (
                  <Badge tone="critico">Prioridade alta</Badge>
                ) : null}
                <Badge
                  tone={
                    t.status === "resolvido"
                      ? "ok"
                      : t.status === "em_andamento"
                        ? "atencao"
                        : "neutral"
                  }
                >
                  {TICKET_STATUS_LABEL[t.status]}
                </Badge>
              </div>
            }
          />
          <CardBody className="space-y-4">
            <ul className="space-y-2.5">
              {t.messages.map((m) => (
                <li
                  key={m.id}
                  className={
                    "rounded-xl px-4 py-3 text-sm leading-relaxed " +
                    (m.author === "carnext"
                      ? "border border-brand-line bg-brand-surface text-brand-soft"
                      : "bg-brand-raised text-brand-soft")
                  }
                >
                  <p className="mb-1 text-[11px] font-medium text-brand-white">
                    {m.authorName} · {dateTime(m.createdAt)}
                  </p>
                  {m.body}
                </li>
              ))}
            </ul>

            {t.status !== "resolvido" ? (
              <div className="space-y-3">
                <label
                  htmlFor={`admin-resp-${t.id}`}
                  className="block text-xs font-medium text-brand-soft"
                >
                  Responder
                </label>
                <Textarea
                  id={`admin-resp-${t.id}`}
                  value={draft[t.id] ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [t.id]: e.target.value }))
                  }
                  placeholder="Resposta ao investidor."
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => reply(t.id, false)}
                    disabled={!(draft[t.id] ?? "").trim()}
                  >
                    Responder
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => reply(t.id, true)}
                    disabled={!(draft[t.id] ?? "").trim()}
                  >
                    Responder e resolver
                  </Button>
                </div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
