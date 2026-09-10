"use client";

import { useAsync } from "@/lib/hooks";
import { PageSkeleton } from "@/components/loading";
import Link from "next/link";
import { getAdminOverview } from "@/lib/data/admin";
import { PageHeader } from "@/components/shell";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  LinkButton,
  Table,
  Td,
  Th,
  TotalRow,
} from "@/components/ui";
import { date, money } from "@/lib/format";

export default function AdminInvestorsPage() {
  const q = useAsync(() => getAdminOverview(), []);
  if (q.status === "loading") return <PageSkeleton cards={3} />;
  const { positions } = q.data;

  const totals = positions.reduce(
    (acc, p) => ({
      contributed: acc.contributed + p.contributedCents,
      allocated: acc.allocated + p.allocatedCents,
      available: acc.available + p.availableCents,
      paid: acc.paid + p.paidProfitCents,
    }),
    { contributed: 0, allocated: 0, available: 0, paid: 0 }
  );

  return (
    <>
      <PageHeader
        title="Investidores"
        description="Cadastro e posição de cada investidor."
        action={
          /* TODO(supabase): abrir formulário de cadastro (insert em investors). */
          <LinkButton href="/admin/investidores" variant="primary">
            Novo investidor
          </LinkButton>
        }
      />

      <Card>
        <CardHeader title="Cadastro" subtitle={`${positions.length} investidores.`} />
        <CardBody className="px-0 py-0">
          <Table>
            <thead>
              <tr>
                <Th>Investidor</Th>
                <Th>Contato</Th>
                <Th>Entrada</Th>
                <Th align="right">Aportado</Th>
                <Th align="right">Alocado</Th>
                <Th align="right">Disponível</Th>
                <Th align="right">Lucro pago</Th>
                <Th align="right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.investor.id}>
                  <Td>
                    <span className="text-brand-white">{p.investor.name}</span>
                    <p className="mt-0.5">
                      <Badge tone={p.investor.status === "ativo" ? "ok" : "neutral"}>
                        {p.investor.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </p>
                  </Td>
                  <Td>
                    <p className="text-xs text-brand-soft">{p.investor.email}</p>
                    <p className="text-[11px] text-brand-muted">{p.investor.phone}</p>
                  </Td>
                  <Td>
                    <span className="tabular text-xs text-brand-soft">
                      {date(p.investor.joinedAt)}
                    </span>
                  </Td>
                  <Td align="right">{money(p.contributedCents)}</Td>
                  <Td align="right">{money(p.allocatedCents)}</Td>
                  <Td align="right">{money(p.availableCents)}</Td>
                  <Td align="right">
                    <span className={p.paidProfitCents > 0 ? "text-gain" : ""}>
                      {money(p.paidProfitCents)}
                    </span>
                  </Td>
                  <Td align="right">
                    <Link
                      href={`/admin/investidores/${p.investor.id}`}
                      className="text-xs text-brand-soft underline decoration-brand-line underline-offset-4 hover:text-brand-white"
                    >
                      Abrir
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <TotalRow>
                <Td className="border-b-0" colSpan={3}>
                  Total
                </Td>
                <Td align="right" className="border-b-0">
                  {money(totals.contributed)}
                </Td>
                <Td align="right" className="border-b-0">
                  {money(totals.allocated)}
                </Td>
                <Td align="right" className="border-b-0">
                  {money(totals.available)}
                </Td>
                <Td align="right" className="border-b-0">
                  {money(totals.paid)}
                </Td>
                <Td className="border-b-0" />
              </TotalRow>
            </tfoot>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
