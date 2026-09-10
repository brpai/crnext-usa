import type { CapitalRequest } from "../types";
import { MOCK_REQUESTS } from "./mock/requests";

/**
 * TODO(supabase): tabela `capital_requests`.
 * Insert permitido ao próprio investidor; update de status apenas para admin.
 */

export async function getInvestorRequests(
  investorId: string
): Promise<CapitalRequest[]> {
  return MOCK_REQUESTS.filter((r) => r.investorId === investorId).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function listRequests(): Promise<CapitalRequest[]> {
  return [...MOCK_REQUESTS].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
