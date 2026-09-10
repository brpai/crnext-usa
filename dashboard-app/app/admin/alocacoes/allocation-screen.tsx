"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Allocation, Investor, Vehicle } from "@/lib/types";
import {
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
  cn,
} from "@/components/ui";
import { date, money, vehicleLabel } from "@/lib/format";

/**
 * Alocação de capital a um VIN, com as duas validações que o domínio exige.
 *
 * TODO(supabase): a validação precisa ser reproduzida no banco — constraint /
 * trigger que rejeite soma de alocações acima de landed_cost_cents, e
 * verificação de capital disponível dentro de uma transação. Validar só no
 * cliente não protege nada.
 */
export function AllocationScreen({
  allocations,
  investors,
  vehicles,
  allVehicles,
  funded,
}: {
  allocations: Allocation[];
  investors: Investor[];
  vehicles: Vehicle[];
  allVehicles: Vehicle[];
  funded: Record<string, number>;
}) {
  const [investorId, setInvestorId] = React.useState(investors[0]?.id ?? "");
  const [vehicleId, setVehicleId] = React.useState(vehicles[0]?.id ?? "");
  const [amount, setAmount] = React.useState("");

  const investor = investors.find((i) => i.id === investorId);
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const amountCents = Math.round((Number(amount) || 0) * 100);

  const alreadyFunded = vehicle ? (funded[vehicle.id] ?? 0) : 0;
  const capacityCents = vehicle ? vehicle.landedCostCents - alreadyFunded : 0;
  const availableCents = investor?.availableCents ?? 0;

  const overCapacity = amountCents > capacityCents;
  const overAvailable = amountCents > availableCents;
  const valid = amountCents > 0 && !overCapacity && !overAvailable;

  const vehicleNames: Record<string, string> = {};
  for (const v of allVehicles) vehicleNames[v.id] = vehicleLabel(v);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
      <div className="xl:col-span-2">
        <Card>
          <CardHeader title="Nova alocação" />
          <CardBody>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setAmount("");
              }}
            >
              <Field label="Investidor" htmlFor="a-investidor">
                <Select
                  id="a-investidor"
                  value={investorId}
                  onChange={(e) => setInvestorId(e.target.value)}
                >
                  {investors.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Veículo (em estoque)" htmlFor="a-veiculo">
                <Select
                  id="a-veiculo"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {vehicleLabel(v)} · {v.vin.slice(-6)}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Valor (USD)" htmlFor="a-valor">
                <Input
                  id="a-valor"
                  type="number"
                  step="0.01"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-invalid={overCapacity || overAvailable}
                  aria-describedby="a-validacao"
                />
              </Field>

              <div id="a-validacao" className="space-y-2" aria-live="polite">
                <Check
                  ok={!overAvailable}
                  label={`Capital disponível do investidor: ${money(availableCents)}`}
                  error={`Excede o disponível em ${money(amountCents - availableCents)}.`}
                  failed={overAvailable}
                />
                <Check
                  ok={!overCapacity}
                  label={`Capacidade livre do veículo: ${money(capacityCents)}`}
                  error={`Excede o custo do veículo em ${money(amountCents - capacityCents)}.`}
                  failed={overCapacity}
                />
              </div>

              {vehicle ? (
                <dl className="space-y-1.5 rounded-xl border border-brand-line bg-brand-raised px-4 py-3 text-xs">
                  <Line label="Custo final do veículo" value={money(vehicle.landedCostCents)} />
                  <Line label="Já alocado" value={money(alreadyFunded)} />
                  <Line
                    label="Participação resultante"
                    value={
                      amountCents > 0
                        ? `${((amountCents / vehicle.landedCostCents) * 100)
                            .toFixed(2)
                            .replace(".", ",")}%`
                        : "—"
                    }
                  />
                </dl>
              ) : null}

              <Button type="submit" className="w-full" disabled={!valid}>
                Alocar capital
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <div className="xl:col-span-3">
        <Card>
          <CardHeader
            title="Alocações registradas"
            subtitle={`${allocations.length} vínculos entre investidores e VINs.`}
          />
          <CardBody className="px-0 py-0">
            <Table>
              <thead>
                <tr>
                  <Th>Investidor</Th>
                  <Th>Veículo</Th>
                  <Th>Data</Th>
                  <Th align="right">Valor</Th>
                  <Th align="right">Participação</Th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((a) => (
                  <tr key={a.id}>
                    <Td>
                      {investors.find((i) => i.id === a.investorId)?.name ??
                        a.investorId}
                    </Td>
                    <Td>
                      <span className="text-brand-soft">
                        {vehicleNames[a.vehicleId] ?? a.vehicleId}
                      </span>
                    </Td>
                    <Td>
                      <span className="tabular text-xs text-brand-soft">
                        {date(a.date)}
                      </span>
                    </Td>
                    <Td align="right">{money(a.amountCents)}</Td>
                    <Td align="right">
                      {a.sharePercent.toFixed(1).replace(".", ",")}%
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Check({
  ok,
  failed,
  label,
  error,
}: {
  ok: boolean;
  failed: boolean;
  label: string;
  error: string;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-[11px] leading-relaxed",
        failed ? "text-loss" : "text-brand-muted"
      )}
    >
      <span className="mt-0.5 shrink-0">
        {failed ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
      </span>
      {failed ? error : label}
    </p>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-brand-muted">{label}</dt>
      <dd className="tabular text-brand-white">{value}</dd>
    </div>
  );
}
