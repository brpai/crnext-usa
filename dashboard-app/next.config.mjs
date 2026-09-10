/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * Export 100% estático: o portal é publicado como arquivos dentro de
   * `/dashboard/` do site carnextusa.com, que é servido estaticamente.
   *
   * Consequências deliberadas:
   *  · nada de server actions nem `cookies()` — a sessão de demonstração é
   *    client-side (ver `lib/session.ts`);
   *  · rotas dinâmicas precisam de `generateStaticParams`;
   *  · `trailingSlash` gera `/veiculos/index.html`, que é o formato que
   *    hospedagem estática (GitHub Pages, Netlify, Apache) serve sem rewrite.
   *
   * TODO(supabase): com backend real, a autenticação passa a ser Supabase Auth
   * no cliente (mesma arquitetura estática) e a proteção dos dados é RLS.
   */
  output: "export",
  basePath: "/dashboard",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
