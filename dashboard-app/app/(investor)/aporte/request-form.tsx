"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import { REQUEST_SUMMARY } from "@/lib/copy";
import { money } from "@/lib/format";

/**
 * Formulário de solicitação de aporte.
 *
 * Deliberadamente SEM simulador: não há campo, botão ou saída que calcule
 * retorno, prazo ou valor esperado a partir do valor digitado.
 *
 * TODO(supabase): trocar o estado local por insert em `capital_requests`
 * (server action), com o investor_id vindo da sessão e não do cliente.
 */
export function RequestForm({ availableCents }: { availableCents: number }) {
  const [sent, setSent] = React.useState(false);
  const [amount, setAmount] = React.useState("");

  if (sent) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle2 size={28} className="text-gain" />
          <h2 className="text-sm font-semibold text-brand-white">
            Solicitação registrada
          </h2>
          <p className="max-w-xs text-xs leading-relaxed text-brand-muted">
            A CarNext vai analisar e responder por aqui. O status aparece na
            lista de solicitações ao lado.
          </p>
          <Button variant="secondary" onClick={() => setSent(false)}>
            Enviar outra solicitação
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Nova solicitação"
        subtitle={`Você tem ${money(availableCents)} de capital disponível, ainda não alocado a nenhum veículo.`}
      />
      <CardBody>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <Field
            label="Valor pretendido (USD)"
            htmlFor="valor"
            hint="Valor que você pretende aportar. Não gera cálculo de retorno."
          >
            <Input
              id="valor"
              name="valor"
              type="number"
              min={1}
              step="0.01"
              inputMode="decimal"
              placeholder="10000.00"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>

          <Field label="Forma de envio" htmlFor="forma">
            <Select id="forma" name="forma" defaultValue="wire">
              <option value="wire">Wire transfer</option>
              <option value="zelle">Zelle</option>
              <option value="ach">ACH</option>
              <option value="cheque">Cheque</option>
              <option value="outro">Outro</option>
            </Select>
          </Field>

          <Field label="Observação" htmlFor="observacao">
            <Textarea
              id="observacao"
              name="observacao"
              placeholder="Algo que a CarNext precise saber sobre este aporte."
            />
          </Field>

          <section
            aria-label="Resumo do que você está solicitando"
            className="rounded-xl border border-brand-line bg-brand-raised px-4 py-3.5"
          >
            <h3 className="text-xs font-semibold text-brand-white">
              O que você está solicitando
            </h3>
            <ul className="mt-2.5 space-y-2">
              {REQUEST_SUMMARY.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-[11px] leading-relaxed text-brand-soft"
                >
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-muted"
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <Button type="submit" className="w-full">
            Enviar solicitação
          </Button>

          <p className="text-[11px] leading-relaxed text-brand-muted">
            Enviar a solicitação não constitui aporte. A CarNext confirma o
            recebimento dos recursos antes de qualquer alocação a veículos.
          </p>
        </form>
      </CardBody>
    </Card>
  );
}
