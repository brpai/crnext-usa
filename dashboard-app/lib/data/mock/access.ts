/* Acesso inicial do protótipo.
   Decisão do Bruno (2026-09-10): por enquanto, somente o Nex entra. */

import type { AccessGrant } from "../../types";

/**
 * SHA-256 do código de acesso do protótipo. O código em si NÃO fica no
 * repositório, que é público: foi combinado diretamente com o Bruno.
 *
 * Não é segurança de verdade — 6 dígitos com hash público podem ser
 * descobertos por força bruta. Só impede que o código fique à vista.
 * A proteção real chega com o Supabase.
 */
export const LOGIN_CODE_SHA256 =
  "f8fb6c836e621698d6c698be15622bbd7dab0aaef288a3573e3d15c566bbe67f";

export const MOCK_ACCESS_GRANTS: AccessGrant[] = [
  {
    id: "acc-07",
    email: "nex@carnextusa.com",
    name: "Nex",
    role: "admin",
    investorId: null,
    status: "ativo",
    createdAt: "2026-09-10T21:00:00Z",
    createdBy: "Bruno Ramos",
    revokedAt: null,
    revokedBy: null,
    lastLoginAt: null,
  },
];
