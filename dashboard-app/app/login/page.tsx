"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AccessError,
  IS_PROTOTYPE,
  normalizeEmail,
  requestLoginCode,
  verifyLoginCode,
} from "@/lib/data/access";
import { readSession, writeSession } from "@/lib/session";
import { homeFor } from "@/lib/hooks";
import { Button, Card, Field, Input } from "@/components/ui";
import { Logo } from "@/components/shell";

/**
 * Login do Portal do Investidor — é a primeira tela que o investidor vê.
 *
 * Só entra quem um admin autorizou na tela Acessos. Sem senha: a pessoa
 * informa o e-mail e recebe um código de 6 dígitos. O papel vem do acesso
 * cadastrado, nunca de uma escolha feita aqui.
 */
export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<"email" | "code">("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  // Já autenticado: segue direto para a área do próprio papel.
  React.useEffect(() => {
    const session = readSession();
    if (session) router.replace(homeFor(session.role));
  }, [router]);

  async function sendCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await requestLoginCode(email);
      setEmail(normalizeEmail(email));
      setCode("");
      setStep("code");
    } catch (err) {
      setError(
        err instanceof AccessError
          ? err.message
          : "Não foi possível enviar o código. Tente novamente."
      );
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const session = await verifyLoginCode(email, code);
      if (!session) {
        setError("Código inválido ou expirado.");
        return;
      }
      writeSession(session);
      router.push(homeFor(session.role));
    } finally {
      setBusy(false);
    }
  }

  function changeEmail() {
    setStep("email");
    setCode("");
    setError(null);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-14" />
          <h1 className="mt-5 text-sm font-medium text-brand-soft">
            Acesso restrito a investidores CarNext
          </h1>
        </div>

        <Card className="p-6">
          {step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <Field label="E-mail" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </Field>

              {error ? (
                <p role="alert" className="text-xs text-loss">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Enviando…" : "Receber código"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verify} className="space-y-4">
              <p className="text-xs leading-relaxed text-brand-muted">
                Se <span className="font-medium text-brand-white">{email}</span>{" "}
                estiver autorizado,{" "}
                {IS_PROTOTYPE
                  ? "informe o seu código de acesso de 6 dígitos."
                  : "você receberá um código de 6 dígitos por e-mail."}
              </p>

              <Field label="Código" htmlFor="code">
                <Input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="tabular text-center text-base tracking-[0.4em]"
                  required
                  autoFocus
                />
              </Field>

              {error ? (
                <p role="alert" className="text-xs text-loss">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={busy}>
                Entrar
              </Button>

              <button
                type="button"
                onClick={changeEmail}
                className="w-full text-center text-xs text-brand-soft underline decoration-brand-line underline-offset-4 hover:text-brand-white"
              >
                Usar outro e-mail
              </button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
