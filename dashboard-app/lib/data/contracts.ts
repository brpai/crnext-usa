import type { Contract } from "../types";
import { MOCK_CONTRACTS } from "./mock/contracts";

/**
 * TODO(supabase): tabela `contracts` + Storage bucket `contracts` (privado),
 * com URL assinada gerada sob demanda. RLS: investidor só lê os próprios.
 */

export async function getInvestorContracts(investorId: string): Promise<Contract[]> {
  return MOCK_CONTRACTS.filter((c) => c.investorId === investorId).sort((a, b) =>
    a.signedAt < b.signedAt ? 1 : -1
  );
}

export async function listContracts(): Promise<Contract[]> {
  return [...MOCK_CONTRACTS].sort((a, b) => (a.signedAt < b.signedAt ? 1 : -1));
}

export async function getContract(id: string): Promise<Contract | null> {
  return MOCK_CONTRACTS.find((c) => c.id === id) ?? null;
}
