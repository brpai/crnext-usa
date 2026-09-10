/* GERADO — dados fictícios de demonstração. Nenhum dado real de investidor.
   Extrato de capital */

import type { CapitalMovement } from "../../types";

export const MOCK_MOVEMENTS: CapitalMovement[] = [
  {
    "id": "mov-001",
    "investorId": "inv-01",
    "type": "aporte",
    "amountCents": 900000,
    "date": "2025-11-06",
    "vehicleId": null,
    "bankReference": "WIRE-8841002",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-010",
    "investorId": "inv-01",
    "type": "alocacao",
    "amountCents": 625000,
    "date": "2026-01-09",
    "vehicleId": "veh-01",
    "bankReference": "ALOC-ALO-001",
    "note": "Capital alocado ao VIN 1C4RJFBG5MC742981 (2021 Jeep Grand Cherokee)."
  },
  {
    "id": "mov-004",
    "investorId": "inv-02",
    "type": "aporte",
    "amountCents": 800000,
    "date": "2026-01-18",
    "vehicleId": null,
    "bankReference": "WIRE-8842206",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-011",
    "investorId": "inv-01",
    "type": "alocacao",
    "amountCents": 308400,
    "date": "2026-01-23",
    "vehicleId": "veh-02",
    "bankReference": "ALOC-ALO-002",
    "note": "Capital alocado ao VIN 5NPE34AF4KH812203 (2019 Hyundai Sonata)."
  },
  {
    "id": "mov-012",
    "investorId": "inv-02",
    "type": "alocacao",
    "amountCents": 205600,
    "date": "2026-01-23",
    "vehicleId": "veh-02",
    "bankReference": "ALOC-ALO-003",
    "note": "Capital alocado ao VIN 5NPE34AF4KH812203 (2019 Hyundai Sonata)."
  },
  {
    "id": "mov-002",
    "investorId": "inv-01",
    "type": "aporte",
    "amountCents": 700000,
    "date": "2026-02-02",
    "vehicleId": null,
    "bankReference": "WIRE-8843117",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-013",
    "investorId": "inv-02",
    "type": "alocacao",
    "amountCents": 573500,
    "date": "2026-02-12",
    "vehicleId": "veh-03",
    "bankReference": "ALOC-ALO-004",
    "note": "Capital alocado ao VIN 2T1BURHE8JC998231 (2020 Toyota Corolla)."
  },
  {
    "id": "mov-019",
    "investorId": "inv-01",
    "type": "alocacao",
    "amountCents": 479200,
    "date": "2026-02-25",
    "vehicleId": "veh-06",
    "bankReference": "ALOC-ALO-010",
    "note": "Capital alocado ao VIN WBA8E9C55GK646901 (2016 BMW 328i)."
  },
  {
    "id": "mov-020",
    "investorId": "inv-03",
    "type": "alocacao",
    "amountCents": 479200,
    "date": "2026-02-25",
    "vehicleId": "veh-06",
    "bankReference": "ALOC-ALO-011",
    "note": "Capital alocado ao VIN WBA8E9C55GK646901 (2016 BMW 328i)."
  },
  {
    "id": "mov-032",
    "investorId": "inv-01",
    "type": "devolucao",
    "amountCents": 625000,
    "date": "2026-02-25",
    "vehicleId": "veh-01",
    "bankReference": "RET-ALO-001",
    "note": "Capital alocado devolvido após a venda do VIN 1C4RJFBG5MC742981."
  },
  {
    "id": "mov-033",
    "investorId": "inv-01",
    "type": "distribuicao_lucro",
    "amountCents": 76500,
    "date": "2026-02-25",
    "vehicleId": "veh-01",
    "bankReference": "DIST-ALO-001",
    "note": "30% do lucro líquido do VIN 1C4RJFBG5MC742981, pro-rata de 100%."
  },
  {
    "id": "mov-006",
    "investorId": "inv-03",
    "type": "aporte",
    "amountCents": 950000,
    "date": "2026-03-01",
    "vehicleId": null,
    "bankReference": "WIRE-8843402",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-014",
    "investorId": "inv-01",
    "type": "alocacao",
    "amountCents": 460500,
    "date": "2026-03-06",
    "vehicleId": "veh-04",
    "bankReference": "ALOC-ALO-005",
    "note": "Capital alocado ao VIN 1FTEW1EP7JFA26610 (2018 Ford F-150)."
  },
  {
    "id": "mov-015",
    "investorId": "inv-02",
    "type": "alocacao",
    "amountCents": 307000,
    "date": "2026-03-06",
    "vehicleId": "veh-04",
    "bankReference": "ALOC-ALO-006",
    "note": "Capital alocado ao VIN 1FTEW1EP7JFA26610 (2018 Ford F-150)."
  },
  {
    "id": "mov-016",
    "investorId": "inv-03",
    "type": "alocacao",
    "amountCents": 255800,
    "date": "2026-03-06",
    "vehicleId": "veh-04",
    "bankReference": "ALOC-ALO-007",
    "note": "Capital alocado ao VIN 1FTEW1EP7JFA26610 (2018 Ford F-150)."
  },
  {
    "id": "mov-034",
    "investorId": "inv-01",
    "type": "devolucao",
    "amountCents": 308400,
    "date": "2026-03-10",
    "vehicleId": "veh-02",
    "bankReference": "RET-ALO-002",
    "note": "Capital alocado devolvido após a venda do VIN 5NPE34AF4KH812203."
  },
  {
    "id": "mov-035",
    "investorId": "inv-01",
    "type": "distribuicao_lucro",
    "amountCents": 36900,
    "date": "2026-03-10",
    "vehicleId": "veh-02",
    "bankReference": "DIST-ALO-002",
    "note": "30% do lucro líquido do VIN 5NPE34AF4KH812203, pro-rata de 60%."
  },
  {
    "id": "mov-036",
    "investorId": "inv-02",
    "type": "devolucao",
    "amountCents": 205600,
    "date": "2026-03-10",
    "vehicleId": "veh-02",
    "bankReference": "RET-ALO-003",
    "note": "Capital alocado devolvido após a venda do VIN 5NPE34AF4KH812203."
  },
  {
    "id": "mov-037",
    "investorId": "inv-02",
    "type": "distribuicao_lucro",
    "amountCents": 24600,
    "date": "2026-03-10",
    "vehicleId": "veh-02",
    "bankReference": "DIST-ALO-003",
    "note": "30% do lucro líquido do VIN 5NPE34AF4KH812203, pro-rata de 40%."
  },
  {
    "id": "mov-038",
    "investorId": "inv-02",
    "type": "devolucao",
    "amountCents": 573500,
    "date": "2026-04-02",
    "vehicleId": "veh-03",
    "bankReference": "RET-ALO-004",
    "note": "Capital alocado devolvido após a venda do VIN 2T1BURHE8JC998231."
  },
  {
    "id": "mov-039",
    "investorId": "inv-02",
    "type": "distribuicao_lucro",
    "amountCents": 72500,
    "date": "2026-04-02",
    "vehicleId": "veh-03",
    "bankReference": "DIST-ALO-004",
    "note": "30% do lucro líquido do VIN 2T1BURHE8JC998231, pro-rata de 100%."
  },
  {
    "id": "mov-008",
    "investorId": "inv-04",
    "type": "aporte",
    "amountCents": 480000,
    "date": "2026-04-11",
    "vehicleId": null,
    "bankReference": "WIRE-8843890",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-017",
    "investorId": "inv-03",
    "type": "alocacao",
    "amountCents": 431500,
    "date": "2026-04-15",
    "vehicleId": "veh-05",
    "bankReference": "ALOC-ALO-008",
    "note": "Capital alocado ao VIN KNDPMCAC8L7712045 (2020 Kia Sportage)."
  },
  {
    "id": "mov-018",
    "investorId": "inv-04",
    "type": "alocacao",
    "amountCents": 184900,
    "date": "2026-04-15",
    "vehicleId": "veh-05",
    "bankReference": "ALOC-ALO-009",
    "note": "Capital alocado ao VIN KNDPMCAC8L7712045 (2020 Kia Sportage)."
  },
  {
    "id": "mov-005",
    "investorId": "inv-02",
    "type": "aporte",
    "amountCents": 900000,
    "date": "2026-05-06",
    "vehicleId": null,
    "bankReference": "WIRE-8844098",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-040",
    "investorId": "inv-01",
    "type": "devolucao",
    "amountCents": 460500,
    "date": "2026-05-08",
    "vehicleId": "veh-04",
    "bankReference": "RET-ALO-005",
    "note": "Capital alocado devolvido após a venda do VIN 1FTEW1EP7JFA26610."
  },
  {
    "id": "mov-041",
    "investorId": "inv-01",
    "type": "distribuicao_lucro",
    "amountCents": 41400,
    "date": "2026-05-08",
    "vehicleId": "veh-04",
    "bankReference": "DIST-ALO-005",
    "note": "30% do lucro líquido do VIN 1FTEW1EP7JFA26610, pro-rata de 45%."
  },
  {
    "id": "mov-042",
    "investorId": "inv-02",
    "type": "devolucao",
    "amountCents": 307000,
    "date": "2026-05-08",
    "vehicleId": "veh-04",
    "bankReference": "RET-ALO-006",
    "note": "Capital alocado devolvido após a venda do VIN 1FTEW1EP7JFA26610."
  },
  {
    "id": "mov-043",
    "investorId": "inv-02",
    "type": "distribuicao_lucro",
    "amountCents": 27600,
    "date": "2026-05-08",
    "vehicleId": "veh-04",
    "bankReference": "DIST-ALO-006",
    "note": "30% do lucro líquido do VIN 1FTEW1EP7JFA26610, pro-rata de 30%."
  },
  {
    "id": "mov-044",
    "investorId": "inv-03",
    "type": "devolucao",
    "amountCents": 255800,
    "date": "2026-05-08",
    "vehicleId": "veh-04",
    "bankReference": "RET-ALO-007",
    "note": "Capital alocado devolvido após a venda do VIN 1FTEW1EP7JFA26610."
  },
  {
    "id": "mov-045",
    "investorId": "inv-03",
    "type": "distribuicao_lucro",
    "amountCents": 23000,
    "date": "2026-05-08",
    "vehicleId": "veh-04",
    "bankReference": "DIST-ALO-007",
    "note": "30% do lucro líquido do VIN 1FTEW1EP7JFA26610, pro-rata de 25%."
  },
  {
    "id": "mov-026",
    "investorId": "inv-01",
    "type": "alocacao",
    "amountCents": 393400,
    "date": "2026-05-20",
    "vehicleId": "veh-10",
    "bankReference": "ALOC-ALO-017",
    "note": "Capital alocado ao VIN JTMRFREV8HD214506 (2017 Toyota Highlander)."
  },
  {
    "id": "mov-027",
    "investorId": "inv-03",
    "type": "alocacao",
    "amountCents": 344200,
    "date": "2026-05-20",
    "vehicleId": "veh-10",
    "bankReference": "ALOC-ALO-018",
    "note": "Capital alocado ao VIN JTMRFREV8HD214506 (2017 Toyota Highlander)."
  },
  {
    "id": "mov-028",
    "investorId": "inv-04",
    "type": "alocacao",
    "amountCents": 245800,
    "date": "2026-05-20",
    "vehicleId": "veh-10",
    "bankReference": "ALOC-ALO-019",
    "note": "Capital alocado ao VIN JTMRFREV8HD214506 (2017 Toyota Highlander)."
  },
  {
    "id": "mov-046",
    "investorId": "inv-03",
    "type": "devolucao",
    "amountCents": 431500,
    "date": "2026-06-14",
    "vehicleId": "veh-05",
    "bankReference": "RET-ALO-008",
    "note": "Capital alocado devolvido após a venda do VIN KNDPMCAC8L7712045."
  },
  {
    "id": "mov-047",
    "investorId": "inv-03",
    "type": "distribuicao_lucro",
    "amountCents": 51600,
    "date": "2026-06-14",
    "vehicleId": "veh-05",
    "bankReference": "DIST-ALO-008",
    "note": "30% do lucro líquido do VIN KNDPMCAC8L7712045, pro-rata de 70%."
  },
  {
    "id": "mov-048",
    "investorId": "inv-04",
    "type": "devolucao",
    "amountCents": 184900,
    "date": "2026-06-14",
    "vehicleId": "veh-05",
    "bankReference": "RET-ALO-009",
    "note": "Capital alocado devolvido após a venda do VIN KNDPMCAC8L7712045."
  },
  {
    "id": "mov-049",
    "investorId": "inv-04",
    "type": "distribuicao_lucro",
    "amountCents": 22100,
    "date": "2026-06-14",
    "vehicleId": "veh-05",
    "bankReference": "DIST-ALO-009",
    "note": "30% do lucro líquido do VIN KNDPMCAC8L7712045, pro-rata de 30%."
  },
  {
    "id": "mov-003",
    "investorId": "inv-01",
    "type": "aporte",
    "amountCents": 400000,
    "date": "2026-06-18",
    "vehicleId": null,
    "bankReference": "ZELLE-5510",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-007",
    "investorId": "inv-03",
    "type": "aporte",
    "amountCents": 600000,
    "date": "2026-07-09",
    "vehicleId": null,
    "bankReference": "ACH-22187",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-050",
    "investorId": "inv-01",
    "type": "devolucao",
    "amountCents": 479200,
    "date": "2026-07-21",
    "vehicleId": "veh-06",
    "bankReference": "RET-ALO-010",
    "note": "Capital alocado devolvido após a venda do VIN WBA8E9C55GK646901."
  },
  {
    "id": "mov-051",
    "investorId": "inv-03",
    "type": "devolucao",
    "amountCents": 479200,
    "date": "2026-07-21",
    "vehicleId": "veh-06",
    "bankReference": "RET-ALO-011",
    "note": "Capital alocado devolvido após a venda do VIN WBA8E9C55GK646901."
  },
  {
    "id": "mov-009",
    "investorId": "inv-04",
    "type": "aporte",
    "amountCents": 260000,
    "date": "2026-07-22",
    "vehicleId": null,
    "bankReference": "ACH-22301",
    "note": "Aporte recebido e disponibilizado para alocação."
  },
  {
    "id": "mov-021",
    "investorId": "inv-01",
    "type": "alocacao",
    "amountCents": 454000,
    "date": "2026-07-29",
    "vehicleId": "veh-07",
    "bankReference": "ALOC-ALO-012",
    "note": "Capital alocado ao VIN 2T3P1RFV8LC098772 (2020 Toyota RAV4)."
  },
  {
    "id": "mov-022",
    "investorId": "inv-02",
    "type": "alocacao",
    "amountCents": 371400,
    "date": "2026-07-29",
    "vehicleId": "veh-07",
    "bankReference": "ALOC-ALO-013",
    "note": "Capital alocado ao VIN 2T3P1RFV8LC098772 (2020 Toyota RAV4)."
  },
  {
    "id": "mov-024",
    "investorId": "inv-03",
    "type": "alocacao",
    "amountCents": 421500,
    "date": "2026-08-02",
    "vehicleId": "veh-09",
    "bankReference": "ALOC-ALO-015",
    "note": "Capital alocado ao VIN 3GNKBBRA6KS587412 (2019 Chevrolet Blazer)."
  },
  {
    "id": "mov-025",
    "investorId": "inv-01",
    "type": "alocacao",
    "amountCents": 175600,
    "date": "2026-08-02",
    "vehicleId": "veh-09",
    "bankReference": "ALOC-ALO-016",
    "note": "Capital alocado ao VIN 3GNKBBRA6KS587412 (2019 Chevrolet Blazer)."
  },
  {
    "id": "mov-023",
    "investorId": "inv-02",
    "type": "alocacao",
    "amountCents": 609500,
    "date": "2026-08-13",
    "vehicleId": "veh-08",
    "bankReference": "ALOC-ALO-014",
    "note": "Capital alocado ao VIN 1N4BL4BV3LC212877 (2020 Nissan Altima)."
  },
  {
    "id": "mov-029",
    "investorId": "inv-02",
    "type": "alocacao",
    "amountCents": 435500,
    "date": "2026-08-30",
    "vehicleId": "veh-11",
    "bankReference": "ALOC-ALO-020",
    "note": "Capital alocado ao VIN 5FNRL6H79MB025913 (2021 Honda Odyssey)."
  },
  {
    "id": "mov-030",
    "investorId": "inv-03",
    "type": "alocacao",
    "amountCents": 435500,
    "date": "2026-08-30",
    "vehicleId": "veh-11",
    "bankReference": "ALOC-ALO-021",
    "note": "Capital alocado ao VIN 5FNRL6H79MB025913 (2021 Honda Odyssey)."
  },
  {
    "id": "mov-031",
    "investorId": "inv-04",
    "type": "alocacao",
    "amountCents": 329500,
    "date": "2026-09-03",
    "vehicleId": "veh-12",
    "bankReference": "ALOC-ALO-022",
    "note": "Capital alocado ao VIN 1G1ZD5ST2LF061334 (2020 Chevrolet Malibu)."
  }
];
