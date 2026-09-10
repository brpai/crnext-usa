/* GERADO — dados fictícios de demonstração. Nenhum dado real de investidor.
   Investidores */

import type { Investor } from "../../types";

export const MOCK_INVESTORS: Investor[] = [
  {
    "id": "inv-01",
    "name": "Ricardo Menezes",
    "email": "ricardo.menezes@example.com",
    "phone": "+1 (407) 555-0142",
    "joinedAt": "2025-11-04",
    "status": "ativo",
    "contributedCents": 2000000,
    "allocatedCents": 1023000,
    "availableCents": 977000,
    "realizedProfitCents": 154800,
    "contractIds": [
      "ctr-01"
    ]
  },
  {
    "id": "inv-02",
    "name": "Patrícia Lombardi",
    "email": "patricia.lombardi@example.com",
    "phone": "+1 (321) 555-0198",
    "joinedAt": "2026-01-16",
    "status": "ativo",
    "contributedCents": 1700000,
    "allocatedCents": 1416400,
    "availableCents": 283600,
    "realizedProfitCents": 124700,
    "contractIds": [
      "ctr-02"
    ]
  },
  {
    "id": "inv-03",
    "name": "Eduardo Tanaka",
    "email": "eduardo.tanaka@example.com",
    "phone": "+1 (689) 555-0177",
    "joinedAt": "2026-02-27",
    "status": "ativo",
    "contributedCents": 1550000,
    "allocatedCents": 1201200,
    "availableCents": 348800,
    "realizedProfitCents": 74600,
    "contractIds": [
      "ctr-03"
    ]
  },
  {
    "id": "inv-04",
    "name": "Helena Vasconcelos",
    "email": "helena.vasconcelos@example.com",
    "phone": "+55 (11) 95555-0163",
    "joinedAt": "2026-04-09",
    "status": "inativo",
    "contributedCents": 740000,
    "allocatedCents": 575300,
    "availableCents": 164700,
    "realizedProfitCents": 22100,
    "contractIds": []
  }
];
