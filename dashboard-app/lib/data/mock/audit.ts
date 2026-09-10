/* GERADO — dados fictícios de demonstração. Nenhum dado real de investidor.
   Log de auditoria */

import type { AuditEvent } from "../../types";

export const MOCK_AUDIT: AuditEvent[] = [
  {
    "id": "aud-001",
    "at": "2026-09-08T17:22:00Z",
    "actor": "Bruno Ramos",
    "action": "registrou custo",
    "entity": "VehicleCost",
    "entityId": "cost-041",
    "detail": "Detail — US$ 240,00 no VIN 5FNRL6H79MB025913"
  },
  {
    "id": "aud-002",
    "at": "2026-09-06T16:42:00Z",
    "actor": "Eduardo Tanaka",
    "action": "criou solicitação de aporte",
    "entity": "CapitalRequest",
    "entityId": "req-02",
    "detail": "US$ 5.000,00 via Zelle"
  },
  {
    "id": "aud-003",
    "at": "2026-09-05T11:18:00Z",
    "actor": "CarNext — Comercial",
    "action": "respondeu ticket",
    "entity": "SupportTicket",
    "entityId": "tkt-02",
    "detail": "Resposta sobre o Highlander em estoque"
  },
  {
    "id": "aud-004",
    "at": "2026-09-02T11:05:00Z",
    "actor": "Ricardo Menezes",
    "action": "criou solicitação de aporte",
    "entity": "CapitalRequest",
    "entityId": "req-01",
    "detail": "US$ 10.000,00 via wire"
  },
  {
    "id": "aud-005",
    "at": "2026-09-02T09:30:00Z",
    "actor": "Bruno Ramos",
    "action": "cadastrou veículo",
    "entity": "Vehicle",
    "entityId": "veh-12",
    "detail": "2020 Chevrolet Malibu LT — VIN 1G1ZD5ST2LF061334"
  },
  {
    "id": "aud-006",
    "at": "2026-08-29T15:12:00Z",
    "actor": "Bruno Ramos",
    "action": "cadastrou veículo",
    "entity": "Vehicle",
    "entityId": "veh-11",
    "detail": "2021 Honda Odyssey EX-L — VIN 5FNRL6H79MB025913"
  },
  {
    "id": "aud-007",
    "at": "2026-07-21T10:44:00Z",
    "actor": "Bruno Ramos",
    "action": "registrou distribuição",
    "entity": "CapitalMovement",
    "entityId": "mov-058",
    "detail": "Venda com prejuízo no VIN WBA8E9C55GK646901 — sem lucro a distribuir"
  },
  {
    "id": "aud-008",
    "at": "2026-07-15T18:03:00Z",
    "actor": "Bruno Ramos",
    "action": "marcou venda",
    "entity": "Vehicle",
    "entityId": "veh-06",
    "detail": "2016 BMW 328i vendido por US$ 9.060,00"
  },
  {
    "id": "aud-009",
    "at": "2026-06-14T09:08:00Z",
    "actor": "Bruno Ramos",
    "action": "registrou distribuição",
    "entity": "CapitalMovement",
    "entityId": "mov-046",
    "detail": "30% do lucro líquido do VIN KNDPMCAC8L7712045"
  },
  {
    "id": "aud-010",
    "at": "2026-06-08T16:51:00Z",
    "actor": "Bruno Ramos",
    "action": "marcou venda",
    "entity": "Vehicle",
    "entityId": "veh-05",
    "detail": "2020 Kia Sportage LX vendido por US$ 8.120,00"
  },
  {
    "id": "aud-011",
    "at": "2026-05-06T10:02:00Z",
    "actor": "Bruno Ramos",
    "action": "aprovou solicitação",
    "entity": "CapitalRequest",
    "entityId": "req-03",
    "detail": "US$ 14.000,00 — wire confirmado"
  },
  {
    "id": "aud-012",
    "at": "2026-05-02T14:30:00Z",
    "actor": "Bruno Ramos",
    "action": "marcou venda",
    "entity": "Vehicle",
    "entityId": "veh-04",
    "detail": "2018 Ford F-150 XLT vendido por US$ 12.680,00"
  }
];
