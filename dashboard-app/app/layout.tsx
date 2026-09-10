import type { Metadata } from "next";
import "./globals.css";
import { BASE } from "@/lib/base";

/**
 * Portão de sessão, antes de qualquer JS do app carregar.
 *
 * O portal é export estático (GitHub Pages): não existe middleware nem
 * redirect no servidor. Este script inline roda no <head> e, sem sessão, troca
 * a página pelo login antes de pintar a visão geral — sem 404 e sem flash de
 * tela com dados. `useRequireRole` continua como guarda dentro do app.
 *
 * O nome do cookie é literal (e não `EMAIL_KEY`) porque `lib/session.ts` é
 * "use client" e este layout é server component — manter os dois em sincronia.
 *
 * TODO(supabase): trocar o teste do cookie simulado `cnx_email` pela sessão
 * real do Supabase Auth (chave `sb-<project-ref>-auth-token` no localStorage,
 * ou cookie equivalente se usar @supabase/ssr). É conveniência de navegação,
 * não segurança: quem protege os dados é a RLS.
 */
const SESSION_GATE = `(function(){try{
  if (/\\/login\\/?$/.test(location.pathname)) return;
  if (/(?:^|; )cnx_email=[^;]+/.test(document.cookie)) return;
  location.replace("${BASE}/login/");
}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Portal do Investidor — CARNEXT USA",
  description:
    "Acompanhamento de capital alocado por veículo, custos e resultados realizados.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: SESSION_GATE }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
