"use client";

import * as React from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Upload, DollarSign, X } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { isSold, INVESTOR_PROFIT_SHARE } from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  Select,
  Table,
  Td,
  Th,
  TotalRow,
} from "@/components/ui";
import { AgingBadge, ResultValue } from "@/components/finance";
import { COST_CATEGORY_LABEL, date, money, vehicleLabel } from "@/lib/format";

type Filter = "todos" | "em_estoque" | "vendido";

export function StockTable({
  vehicles,
  funding,
}: {
  vehicles: Vehicle[];
  funding: Record<string, number>;
}) {
  const [filter, setFilter] = React.useState<Filter>("todos");

  const visible = vehicles.filter((v) => {
    if (filter === "todos") return true;
    if (filter === "vendido") return isSold(v);
    return !isSold(v);
  });

  const totalLanded = visible.reduce((n, v) => n + v.landedCostCents, 0);
  const totalFunded = visible.reduce((n, v) => n + (funding[v.id] ?? 0), 0);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="w-full sm:max-w-xs">
          <Field label="Status" htmlFor="f-status">
            <Select
              id="f-status"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
            >
              <option value="todos">Todos</option>
              <option value="em_estoque">Em estoque</option>
              <option value="vendido">Vendidos</option>
            </Select>
          </Field>
        </div>
        {/* TODO(supabase): insert em vehicles + upload no Storage. */}
        <Button variant="primary">
          <Plus size={15} /> Cadastrar veículo
        </Button>
      </div>

      <Card>
        <CardHeader
          title="Veículos"
          subtitle={`${visible.length} no filtro atual.`}
        />
        <CardBody className="px-0 py-0">
          <Table>
            <thead>
              <tr>
                <Th>Veículo</Th>
                <Th>Status</Th>
                <Th align="right">Aquisição</Th>
                <Th align="right">Custos</Th>
                <Th align="right">Custo final</Th>
                <Th align="right">Capital alocado</Th>
                <Th align="right">Resultado</Th>
                <Th align="right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {visible.map((v) => (
                <tr key={v.id}>
                  <Td>
                    <Link
                      href={`/veiculos/${v.id}`}
                      className="text-brand-white hover:underline"
                    >
                      {vehicleLabel(v)}
                    </Link>
                    <p className="mt-0.5 font-mono text-[11px] text-brand-muted">
                      {v.vin}
                    </p>
                  </Td>
                  <Td>
                    {isSold(v) ? (
                      <>
                        <Badge tone="ok">Vendido</Badge>
                        <p className="mt-1 tabular text-[11px] text-brand-muted">
                          {date(v.saleDate)} · {v.daysInStock} dias
                        </p>
                      </>
                    ) : (
                      <AgingBadge days={v.daysInStock} />
                    )}
                  </Td>
                  <Td align="right">{money(v.acquisitionCostCents)}</Td>
                  <Td align="right">{money(v.variableCostsCents)}</Td>
                  <Td align="right">{money(v.landedCostCents)}</Td>
                  <Td align="right">
                    {money(funding[v.id] ?? 0)}
                    <p className="text-[11px] font-normal text-brand-muted">
                      {(
                        ((funding[v.id] ?? 0) / v.landedCostCents) *
                        100
                      ).toFixed(0)}
                      % do custo
                    </p>
                  </Td>
                  <Td align="right">
                    {isSold(v) ? (
                      <ResultValue cents={v.netProfitCents} size="sm" />
                    ) : (
                      <span className="text-xs text-brand-muted">
                        Apurado na venda
                      </span>
                    )}
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end gap-1.5">
                      <CostDialog vehicle={v} />
                      {!isSold(v) ? <SaleDialog vehicle={v} funding={funding[v.id] ?? 0} /> : null}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <TotalRow>
                <Td className="border-b-0" colSpan={4}>
                  Total
                </Td>
                <Td align="right" className="border-b-0">
                  {money(totalLanded)}
                </Td>
                <Td align="right" className="border-b-0">
                  {money(totalFunded)}
                </Td>
                <Td className="border-b-0" />
                <Td className="border-b-0" />
              </TotalRow>
            </tfoot>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}

/* ─────────────────────── Lançar custo por VIN ──────────────────────────── */

function CostDialog({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          type="button"
          className="rounded-lg border border-brand-line bg-brand-raised p-1.5 text-brand-soft hover:border-brand-muted"
          aria-label={`Lançar custo em ${vehicleLabel(vehicle)}`}
        >
          <Plus size={14} />
        </button>
      }
      title="Lançar custo"
      description={`VIN ${vehicle.vin} · ${vehicleLabel(vehicle)}`}
    >
      {/* TODO(supabase): insert em vehicle_costs + upload do comprovante. */}
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <Field label="Categoria" htmlFor="cat">
          <Select id="cat" defaultValue="mecanica">
            {Object.entries(COST_CATEGORY_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Descrição" htmlFor="desc">
          <Input id="desc" required placeholder="Ex.: troca de pastilhas" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Valor (USD)" htmlFor="val">
            <Input id="val" type="number" step="0.01" min={0} required />
          </Field>
          <Field label="Data" htmlFor="dt">
            <Input id="dt" type="date" required />
          </Field>
        </div>
        <Field label="Fornecedor" htmlFor="forn">
          <Input id="forn" required placeholder="NextRepair" />
        </Field>
        <Field label="Comprovante" htmlFor="comp" hint="Upload simulado no protótipo.">
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-brand-line px-3.5 py-3 text-xs text-brand-muted">
            <Upload size={15} /> Selecionar arquivo
          </div>
        </Field>
        <Button type="submit" className="w-full">
          Lançar custo
        </Button>
      </form>
    </Modal>
  );
}

/* ─────────────── Marcar venda com rateio automático do lucro ───────────── */

function SaleDialog({
  vehicle,
  funding,
}: {
  vehicle: Vehicle;
  funding: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [price, setPrice] = React.useState("");

  const priceCents = Math.round((Number(price) || 0) * 100);
  const netProfit = priceCents ? priceCents - vehicle.landedCostCents : 0;
  const investorPool = netProfit > 0 ? Math.round(netProfit * INVESTOR_PROFIT_SHARE) : 0;

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          type="button"
          className="rounded-lg border border-brand-line bg-brand-raised p-1.5 text-brand-soft hover:border-brand-muted"
          aria-label={`Marcar venda de ${vehicleLabel(vehicle)}`}
        >
          <DollarSign size={14} />
        </button>
      }
      title="Marcar venda"
      description={`VIN ${vehicle.vin} · custo final ${money(vehicle.landedCostCents)}`}
    >
      {/* TODO(supabase): update em vehicles + insert das distribuições rateadas. */}
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Preço de venda (USD)" htmlFor="preco">
            <Input
              id="preco"
              type="number"
              step="0.01"
              min={0}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Field>
          <Field label="Data da venda" htmlFor="data-venda">
            <Input id="data-venda" type="date" required />
          </Field>
        </div>

        <div className="space-y-2 rounded-xl border border-brand-line bg-brand-raised px-4 py-3.5 text-sm">
          <Row label="Custo final" value={money(vehicle.landedCostCents)} />
          <Row label="Capital de investidores" value={money(funding)} />
          <div className="flex items-baseline justify-between gap-3 border-t border-brand-line pt-2">
            <span className="text-brand-muted">
              {netProfit >= 0 ? "Lucro líquido" : "Prejuízo"}
            </span>
            <ResultValue cents={netProfit} size="sm" />
          </div>
          <Row
            label="Aos investidores (30%)"
            value={money(investorPool)}
            hint={
              netProfit > 0
                ? "Rateado pro-rata da participação de cada um."
                : "Sem lucro líquido, não há distribuição."
            }
          />
          <Row label="À CarNext (70%)" value={money(netProfit > 0 ? netProfit - investorPool : 0)} />
        </div>

        <Button type="submit" className="w-full" disabled={!priceCents}>
          Registrar venda
        </Button>
      </form>
    </Modal>
  );
}

function Row({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-brand-muted">{label}</span>
        <span className="tabular text-brand-white">{value}</span>
      </div>
      {hint ? <p className="mt-0.5 text-[11px] text-brand-muted">{hint}</p> : null}
    </div>
  );
}

/* ─────────────────────────────── Modal base ────────────────────────────── */

function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-brand-white/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-brand-line bg-brand-surface p-6 focus:outline-none">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-sm font-semibold text-brand-white">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-brand-muted">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className="rounded-lg p-1.5 text-brand-muted hover:bg-brand-raised hover:text-brand-white"
            >
              <X size={16} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
