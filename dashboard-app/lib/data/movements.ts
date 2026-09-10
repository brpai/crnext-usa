import type { CapitalMovement, Cents, MovementType } from "../types";
import { MOCK_MOVEMENTS } from "./mock/movements";

/**
 * Extrato de capital.
 *
 * Saldo em custódia = aportes − alocações + devoluções.
 * Distribuições de lucro são pagas diretamente ao investidor e por isso
 * aparecem como linha, mas não movimentam o saldo em custódia. A tabela
 * mostra as duas colunas para que a distinção fique explícita.
 *
 * TODO(supabase): select * from capital_movements where investor_id = $1
 * (RLS: auth.uid() → investor_id) com filtros de tipo e período no servidor.
 */

export interface MovementRow extends CapitalMovement {
  /** Saldo em custódia após este movimento. */
  balanceCents: Cents;
  /** Lucro acumulado pago até este movimento. */
  cumulativeProfitCents: Cents;
}

export interface MovementFilter {
  types?: MovementType[];
  from?: string;
  to?: string;
}

function signedCustodyDelta(m: CapitalMovement): number {
  switch (m.type) {
    case "aporte":
      return m.amountCents;
    case "devolucao":
      return m.amountCents;
    case "alocacao":
      return -m.amountCents;
    case "distribuicao_lucro":
      return 0; // pago ao investidor; não permanece em custódia
  }
}

export async function getInvestorMovements(
  investorId: string,
  filter: MovementFilter = {}
): Promise<MovementRow[]> {
  const all = MOCK_MOVEMENTS.filter((m) => m.investorId === investorId).sort(
    (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1)
  );

  // Saldo é calculado sobre a série completa e só depois filtrado, para que
  // um recorte de período não invente um saldo inicial zerado.
  let balance = 0;
  let profit = 0;
  const rows: MovementRow[] = all.map((m) => {
    balance += signedCustodyDelta(m);
    if (m.type === "distribuicao_lucro") profit += m.amountCents;
    return { ...m, balanceCents: balance, cumulativeProfitCents: profit };
  });

  return rows.filter((r) => {
    if (filter.types?.length && !filter.types.includes(r.type)) return false;
    if (filter.from && r.date < filter.from) return false;
    if (filter.to && r.date > filter.to) return false;
    return true;
  });
}

export async function listAllMovements(): Promise<CapitalMovement[]> {
  return [...MOCK_MOVEMENTS];
}
