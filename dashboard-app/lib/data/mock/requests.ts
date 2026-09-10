/* GERADO — dados fictícios de demonstração. Nenhum dado real de investidor.
   Solicitações de aporte */

import type { CapitalRequest } from "../../types";

export const MOCK_REQUESTS: CapitalRequest[] = [
  {
    "id": "req-01",
    "investorId": "inv-01",
    "amountCents": 1000000,
    "method": "wire",
    "message": "Quero aumentar a posição nas próximas aquisições.",
    "status": "em_analise",
    "createdAt": "2026-09-02T11:05:00Z",
    "respondedAt": null,
    "adminResponse": null
  },
  {
    "id": "req-02",
    "investorId": "inv-03",
    "amountCents": 500000,
    "method": "zelle",
    "message": "Aporte adicional; posso enviar ainda esta semana.",
    "status": "pendente",
    "createdAt": "2026-09-06T16:42:00Z",
    "respondedAt": null,
    "adminResponse": null
  },
  {
    "id": "req-03",
    "investorId": "inv-02",
    "amountCents": 1400000,
    "method": "wire",
    "message": "Confirmando o aporte combinado por telefone.",
    "status": "aprovado",
    "createdAt": "2026-05-02T09:15:00Z",
    "respondedAt": "2026-05-05T10:02:00Z",
    "adminResponse": "Aporte confirmado e creditado. Wire recebido em 06/05."
  }
];
