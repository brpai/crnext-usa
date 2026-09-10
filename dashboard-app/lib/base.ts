/**
 * Prefixo público do app. Precisa bater com `basePath` do next.config.mjs.
 *
 * O <Link> do Next já prefixa sozinho; isto existe para os casos em que
 * montamos a URL na mão (src de imagem, window.location).
 */
export const BASE = "/dashboard";

/**
 * Resolve o caminho de uma mídia do veículo para URL pública.
 *
 * Os dados guardam o caminho ("/mock/veh-01-1.svg"), não a URL — é a camada de
 * apresentação que sabe onde o app está montado.
 *
 * TODO(supabase): com Storage, isto vira a URL assinada do bucket.
 */
export function assetUrl(path: string): string {
  return path.startsWith("/") ? `${BASE}${path}` : path;
}
