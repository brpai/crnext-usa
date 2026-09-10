"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import { getAuditLog } from "@/lib/data/admin";
import { PageHeader } from "@/components/shell";
import {
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { dateTime } from "@/lib/format";

export default function AdminAuditPage() {
  const q = useAsync(() => getAuditLog(), []);
  if (q.status === "loading") return <PageSkeleton cards={2} />;
  const events = q.data;

  return (
    <>
      <PageHeader
        title="Auditoria"
        description="Registro de quem alterou o quê e quando. É este log que sustenta a confiança do investidor no que ele vê no portal."
      />

      <Card>
        <CardHeader
          title="Eventos"
          subtitle={`${events.length} registros. No protótipo o log é fictício e somente leitura.`}
        />
        <CardBody className="px-0 py-0">
          {events.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Nenhum evento registrado"
                description="Alterações em investidores, veículos, custos, alocações e distribuições aparecem aqui."
              />
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Quando</Th>
                  <Th>Quem</Th>
                  <Th>Ação</Th>
                  <Th>Entidade</Th>
                  <Th>Detalhe</Th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <Td>
                      <span className="tabular whitespace-nowrap text-xs text-brand-soft">
                        {dateTime(e.at)}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-brand-white">{e.actor}</span>
                    </Td>
                    <Td>
                      <span className="text-brand-soft">{e.action}</span>
                    </Td>
                    <Td>
                      <span className="text-xs text-brand-soft">{e.entity}</span>
                      <p className="font-mono text-[11px] text-brand-muted">
                        {e.entityId}
                      </p>
                    </Td>
                    <Td>
                      <span className="text-xs leading-relaxed text-brand-soft">
                        {e.detail}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* TODO(supabase): tabela append-only `audit_events`, escrita por triggers
          nas tabelas de domínio, com RLS que permite leitura apenas a admin. */}
    </>
  );
}
