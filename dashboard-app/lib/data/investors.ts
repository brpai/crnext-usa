import type { Investor } from "../types";
import { MOCK_INVESTORS } from "./mock/investors";

/**
 * TODO(supabase): `investors` com RLS — o investidor autenticado só enxerga a
 * própria linha (auth.uid() = investors.auth_user_id); admin enxerga todas.
 */

export async function listInvestors(): Promise<Investor[]> {
  return [...MOCK_INVESTORS].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function getInvestor(id: string): Promise<Investor | null> {
  return MOCK_INVESTORS.find((i) => i.id === id) ?? null;
}
