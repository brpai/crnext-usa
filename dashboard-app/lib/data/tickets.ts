import type { SupportTicket } from "../types";
import { MOCK_TICKETS } from "./mock/tickets";

/**
 * TODO(supabase): tabelas `support_tickets` e `ticket_messages`.
 * RLS por investor_id; admin lê e responde todos.
 */

export async function getInvestorTickets(
  investorId: string
): Promise<SupportTicket[]> {
  return MOCK_TICKETS.filter((t) => t.investorId === investorId).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1
  );
}

export async function listTickets(): Promise<SupportTicket[]> {
  return [...MOCK_TICKETS].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getTicket(id: string): Promise<SupportTicket | null> {
  return MOCK_TICKETS.find((t) => t.id === id) ?? null;
}
