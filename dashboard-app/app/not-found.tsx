import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-muted">
        Página não encontrada
      </p>
      <h1 className="text-2xl font-semibold text-brand-white">
        Não localizamos o que você procura
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-brand-muted">
        O endereço pode ter mudado, ou o recurso não está disponível para o seu
        perfil.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-brand-white px-4 py-2.5 text-sm font-medium text-brand-black hover:bg-brand-accent"
      >
        Voltar ao portal
      </Link>
    </div>
  );
}
