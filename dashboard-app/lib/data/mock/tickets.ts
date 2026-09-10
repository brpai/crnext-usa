/* GERADO — dados fictícios de demonstração. Nenhum dado real de investidor.
   Tickets de suporte */

import type { SupportTicket } from "../../types";

export const MOCK_TICKETS: SupportTicket[] = [
  {
    "id": "tkt-01",
    "investorId": "inv-01",
    "subject": "Comprovante da funilaria do F-150",
    "category": "veiculo",
    "status": "resolvido",
    "priority": "normal",
    "createdAt": "2026-04-02T10:12:00Z",
    "updatedAt": "2026-04-03T09:40:00Z",
    "messages": [
      {
        "id": "msg-01",
        "author": "investidor",
        "authorName": "Ricardo Menezes",
        "body": "Vi o lançamento de funilaria de US$ 1.640 no VIN 1FTEW1EP7JFA26610. Consigo ver a nota?",
        "createdAt": "2026-04-02T10:12:00Z"
      },
      {
        "id": "msg-02",
        "author": "carnext",
        "authorName": "CarNext — Financeiro",
        "body": "Claro. O comprovante está anexado ao lançamento na tela do veículo, na linha de funilaria. É reparo de caçamba mais pintura parcial, feito na NextPaint.",
        "createdAt": "2026-04-03T09:40:00Z"
      }
    ]
  },
  {
    "id": "tkt-02",
    "investorId": "inv-03",
    "subject": "Highlander segue em estoque",
    "category": "veiculo",
    "status": "em_andamento",
    "priority": "alta",
    "createdAt": "2026-08-28T14:03:00Z",
    "updatedAt": "2026-09-05T11:18:00Z",
    "messages": [
      {
        "id": "msg-03",
        "author": "investidor",
        "authorName": "Eduardo Tanaka",
        "body": "O Highlander está há bastante tempo no pátio. O que está sendo feito?",
        "createdAt": "2026-08-28T14:03:00Z"
      },
      {
        "id": "msg-04",
        "author": "carnext",
        "authorName": "CarNext — Comercial",
        "body": "O veículo teve o capô repintado e trocamos os pneus. Está anunciado nos canais e recebeu três visitas na última semana. Não temos data de venda a informar — quando for vendido, o resultado é apurado e você recebe a distribuição referente à sua participação.",
        "createdAt": "2026-09-05T11:18:00Z"
      }
    ]
  },
  {
    "id": "tkt-03",
    "investorId": "inv-02",
    "subject": "Exportar extrato para o contador",
    "category": "financeiro",
    "status": "aberto",
    "priority": "baixa",
    "createdAt": "2026-09-07T08:55:00Z",
    "updatedAt": "2026-09-07T08:55:00Z",
    "messages": [
      {
        "id": "msg-05",
        "author": "investidor",
        "authorName": "Patrícia Lombardi",
        "body": "Consigo exportar o extrato do ano todo em um arquivo só?",
        "createdAt": "2026-09-07T08:55:00Z"
      }
    ]
  }
];
