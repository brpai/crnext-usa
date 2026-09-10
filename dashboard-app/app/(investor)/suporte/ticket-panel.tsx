"use client";

import * as React from "react";
import { MessageSquare, Plus } from "lucide-react";
import type { SupportTicket } from "@/lib/types";
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
  Textarea,
} from "@/components/ui";
import { TICKET_CATEGORY_LABEL, TICKET_STATUS_LABEL, dateTime } from "@/lib/format";

/**
 * TODO(supabase): insert em `support_tickets` / `ticket_messages` por server
 * action; o estado local existe só para o protótipo ser navegável.
 */
export function TicketPanel({ tickets }: { tickets: SupportTicket[] }) {
  const [list, setList] = React.useState(tickets);
  const [composing, setComposing] = React.useState(false);
  const [reply, setReply] = React.useState<Record<string, string>>({});

  function createTicket(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const now = new Date().toISOString();
    const ticket: SupportTicket = {
      id: `tkt-local-${Date.now()}`,
      investorId: tickets[0]?.investorId ?? "inv-01",
      subject: String(form.get("assunto") ?? "Sem assunto"),
      category: (form.get("categoria") as SupportTicket["category"]) ?? "outro",
      status: "aberto",
      priority: "normal",
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `msg-local-${Date.now()}`,
          author: "investidor",
          authorName: "Você",
          body: String(form.get("mensagem") ?? ""),
          createdAt: now,
        },
      ],
    };
    setList((l) => [ticket, ...l]);
    setComposing(false);
  }

  function sendReply(ticketId: string) {
    const body = (reply[ticketId] ?? "").trim();
    if (!body) return;
    const now = new Date().toISOString();
    setList((l) =>
      l.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              updatedAt: now,
              messages: [
                ...t.messages,
                {
                  id: `msg-local-${Date.now()}`,
                  author: "investidor",
                  authorName: "Você",
                  body,
                  createdAt: now,
                },
              ],
            }
          : t
      )
    );
    setReply((r) => ({ ...r, [ticketId]: "" }));
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="Seus tickets"
          action={
            <Button
              variant={composing ? "ghost" : "secondary"}
              onClick={() => setComposing((v) => !v)}
            >
              <Plus size={15} /> {composing ? "Cancelar" : "Abrir ticket"}
            </Button>
          }
        />
        {composing ? (
          <CardBody className="border-b border-brand-line">
            <form className="space-y-4" onSubmit={createTicket}>
              <Field label="Assunto" htmlFor="assunto">
                <Input id="assunto" name="assunto" required placeholder="Resuma sua dúvida" />
              </Field>
              <Field label="Categoria" htmlFor="categoria">
                <Select id="categoria" name="categoria" defaultValue="financeiro">
                  {Object.entries(TICKET_CATEGORY_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Mensagem" htmlFor="mensagem">
                <Textarea id="mensagem" name="mensagem" required placeholder="Descreva o que você precisa." />
              </Field>
              <Button type="submit" className="w-full">
                Enviar
              </Button>
            </form>
          </CardBody>
        ) : null}

        <CardBody className="px-0 py-0">
          {list.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={<MessageSquare size={24} />}
                title="Nenhum ticket aberto"
                description="Se a sua dúvida não estiver nas perguntas frequentes, abra um ticket e a CarNext responde por aqui."
              />
            </div>
          ) : (
            <ul className="divide-y divide-brand-line/60">
              {list.map((t) => (
                <li key={t.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-white">
                        {t.subject}
                      </p>
                      <p className="mt-0.5 text-[11px] text-brand-muted">
                        {TICKET_CATEGORY_LABEL[t.category]} · atualizado em{" "}
                        {dateTime(t.updatedAt)}
                      </p>
                    </div>
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

                  <ul className="mt-3 space-y-2.5">
                    {t.messages.map((m) => (
                      <li
                        key={m.id}
                        className={
                          "rounded-xl px-3 py-2.5 text-xs leading-relaxed " +
                          (m.author === "investidor"
                            ? "bg-brand-raised text-brand-soft"
                            : "border border-brand-line bg-brand-surface text-brand-soft")
                        }
                      >
                        <p className="mb-1 text-[11px] font-medium text-brand-white">
                          {m.authorName}
                        </p>
                        {m.body}
                      </li>
                    ))}
                  </ul>

                  {t.status !== "resolvido" ? (
                    <div className="mt-3 flex gap-2">
                      <label htmlFor={`resposta-${t.id}`} className="sr-only">
                        Responder no ticket {t.subject}
                      </label>
                      <Input
                        id={`resposta-${t.id}`}
                        value={reply[t.id] ?? ""}
                        onChange={(e) =>
                          setReply((r) => ({ ...r, [t.id]: e.target.value }))
                        }
                        placeholder="Escreva uma resposta"
                      />
                      <Button
                        variant="secondary"
                        onClick={() => sendReply(t.id)}
                        disabled={!(reply[t.id] ?? "").trim()}
                      >
                        Enviar
                      </Button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
