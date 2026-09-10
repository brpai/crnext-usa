/* GERADO — dados fictícios de demonstração. Nenhum dado real de investidor.
   Contratos */

import type { Contract } from "../../types";

export const MOCK_CONTRACTS: Contract[] = [
  {
    "id": "ctr-01",
    "investorId": "inv-01",
    "title": "Acordo de Participação por Veículo — Ricardo Menezes",
    "signedAt": "2025-11-04",
    "validFrom": "2025-11-04",
    "validUntil": "2026-11-04",
    "status": "vigente",
    "pdfUrl": "/mock/contracts/ctr-01.pdf",
    "summaryBullets": [
      "Participação de 30% do lucro líquido de cada veículo em que houver capital alocado — os 70% restantes cabem à CarNext.",
      "O pagamento é devido exclusivamente no momento em que cada veículo específico for vendido. Não há prazo, data prevista ou valor garantido.",
      "O lucro líquido é o preço de venda menos o custo final do veículo (aquisição mais todos os custos variáveis lançados naquele VIN).",
      "Havendo mais de um investidor no mesmo veículo, os 30% são rateados pro-rata do capital alocado por cada um.",
      "Se o veículo não for vendido, não há pagamento. Se for vendido com prejuízo, não há lucro a distribuir.",
      "Vigência de 1 ano, contada da assinatura. Vigência é o período de validade do acordo, não prazo de pagamento nem de devolução de capital.",
      "TODO: CONFIRMAR — condição de saída antecipada, tratamento do prejuízo sobre o capital e rateio do custo operacional fixo."
    ]
  },
  {
    "id": "ctr-02",
    "investorId": "inv-02",
    "title": "Acordo de Participação por Veículo — Patrícia Lombardi",
    "signedAt": "2026-01-16",
    "validFrom": "2026-01-16",
    "validUntil": "2027-01-16",
    "status": "vigente",
    "pdfUrl": "/mock/contracts/ctr-02.pdf",
    "summaryBullets": [
      "Participação de 30% do lucro líquido de cada veículo em que houver capital alocado — os 70% restantes cabem à CarNext.",
      "O pagamento é devido exclusivamente no momento em que cada veículo específico for vendido. Não há prazo, data prevista ou valor garantido.",
      "O lucro líquido é o preço de venda menos o custo final do veículo (aquisição mais todos os custos variáveis lançados naquele VIN).",
      "Havendo mais de um investidor no mesmo veículo, os 30% são rateados pro-rata do capital alocado por cada um.",
      "Se o veículo não for vendido, não há pagamento. Se for vendido com prejuízo, não há lucro a distribuir.",
      "Vigência de 1 ano, contada da assinatura. Vigência é o período de validade do acordo, não prazo de pagamento nem de devolução de capital.",
      "TODO: CONFIRMAR — condição de saída antecipada, tratamento do prejuízo sobre o capital e rateio do custo operacional fixo."
    ]
  },
  {
    "id": "ctr-03",
    "investorId": "inv-03",
    "title": "Acordo de Participação por Veículo — Eduardo Tanaka",
    "signedAt": "2026-02-27",
    "validFrom": "2026-02-27",
    "validUntil": "2027-02-27",
    "status": "vigente",
    "pdfUrl": "/mock/contracts/ctr-03.pdf",
    "summaryBullets": [
      "Participação de 30% do lucro líquido de cada veículo em que houver capital alocado — os 70% restantes cabem à CarNext.",
      "O pagamento é devido exclusivamente no momento em que cada veículo específico for vendido. Não há prazo, data prevista ou valor garantido.",
      "O lucro líquido é o preço de venda menos o custo final do veículo (aquisição mais todos os custos variáveis lançados naquele VIN).",
      "Havendo mais de um investidor no mesmo veículo, os 30% são rateados pro-rata do capital alocado por cada um.",
      "Se o veículo não for vendido, não há pagamento. Se for vendido com prejuízo, não há lucro a distribuir.",
      "Vigência de 1 ano, contada da assinatura. Vigência é o período de validade do acordo, não prazo de pagamento nem de devolução de capital.",
      "TODO: CONFIRMAR — condição de saída antecipada, tratamento do prejuízo sobre o capital e rateio do custo operacional fixo."
    ]
  }
];
