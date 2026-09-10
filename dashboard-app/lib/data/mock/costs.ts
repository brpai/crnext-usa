/* GERADO — dados fictícios de demonstração. Nenhum dado real de investidor.
   Custos variáveis por VIN */

import type { VehicleCost } from "../../types";

export const MOCK_COSTS: VehicleCost[] = [
  {
    "id": "cost-001",
    "vehicleId": "veh-01",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 38500,
    "date": "2026-01-08",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-01-001.pdf"
  },
  {
    "id": "cost-002",
    "vehicleId": "veh-01",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 19000,
    "date": "2026-01-10",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-01-002.pdf"
  },
  {
    "id": "cost-003",
    "vehicleId": "veh-01",
    "category": "mecanica",
    "description": "Troca de correia e fluidos",
    "amountCents": 62000,
    "date": "2026-01-17",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-01-003.pdf"
  },
  {
    "id": "cost-004",
    "vehicleId": "veh-01",
    "category": "pecas",
    "description": "Bateria e palhetas",
    "amountCents": 20000,
    "date": "2026-01-20",
    "supplier": "AutoZone Pro",
    "receiptUrl": "/mock/receipts/veh-01-004.pdf"
  },
  {
    "id": "cost-005",
    "vehicleId": "veh-01",
    "category": "detail",
    "description": "Polimento e higienização",
    "amountCents": 22000,
    "date": "2026-01-29",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-01-005.pdf"
  },
  {
    "id": "cost-006",
    "vehicleId": "veh-01",
    "category": "documentacao",
    "description": "Title e placa",
    "amountCents": 18500,
    "date": "2026-02-03",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-01-006.pdf"
  },
  {
    "id": "cost-007",
    "vehicleId": "veh-02",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 34000,
    "date": "2026-01-22",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-02-007.pdf"
  },
  {
    "id": "cost-008",
    "vehicleId": "veh-02",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 18000,
    "date": "2026-01-25",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-02-008.pdf"
  },
  {
    "id": "cost-009",
    "vehicleId": "veh-02",
    "category": "mecanica",
    "description": "Pastilhas e discos dianteiros",
    "amountCents": 41000,
    "date": "2026-01-30",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-02-009.pdf"
  },
  {
    "id": "cost-010",
    "vehicleId": "veh-02",
    "category": "pecas",
    "description": "Bateria e sensor ABS",
    "amountCents": 27500,
    "date": "2026-02-03",
    "supplier": "AutoZone Pro",
    "receiptUrl": "/mock/receipts/veh-02-010.pdf"
  },
  {
    "id": "cost-011",
    "vehicleId": "veh-02",
    "category": "detail",
    "description": "Detail completo",
    "amountCents": 24000,
    "date": "2026-02-09",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-02-011.pdf"
  },
  {
    "id": "cost-012",
    "vehicleId": "veh-02",
    "category": "documentacao",
    "description": "Title, placa e emplacamento",
    "amountCents": 17500,
    "date": "2026-02-15",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-02-012.pdf"
  },
  {
    "id": "cost-013",
    "vehicleId": "veh-03",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 36000,
    "date": "2026-02-11",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-03-013.pdf"
  },
  {
    "id": "cost-014",
    "vehicleId": "veh-03",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 18000,
    "date": "2026-02-13",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-03-014.pdf"
  },
  {
    "id": "cost-015",
    "vehicleId": "veh-03",
    "category": "mecanica",
    "description": "Revisão completa 70k",
    "amountCents": 46000,
    "date": "2026-02-18",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-03-015.pdf"
  },
  {
    "id": "cost-016",
    "vehicleId": "veh-03",
    "category": "pecas",
    "description": "Filtros e velas",
    "amountCents": 16000,
    "date": "2026-02-21",
    "supplier": "AutoZone Pro",
    "receiptUrl": "/mock/receipts/veh-03-016.pdf"
  },
  {
    "id": "cost-017",
    "vehicleId": "veh-03",
    "category": "detail",
    "description": "Detail e retoque de para-choque",
    "amountCents": 22000,
    "date": "2026-02-26",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-03-017.pdf"
  },
  {
    "id": "cost-018",
    "vehicleId": "veh-03",
    "category": "documentacao",
    "description": "Title e placa",
    "amountCents": 17500,
    "date": "2026-03-05",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-03-018.pdf"
  },
  {
    "id": "cost-019",
    "vehicleId": "veh-04",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 44000,
    "date": "2026-03-05",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-04-019.pdf"
  },
  {
    "id": "cost-020",
    "vehicleId": "veh-04",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 24000,
    "date": "2026-03-07",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-04-020.pdf"
  },
  {
    "id": "cost-021",
    "vehicleId": "veh-04",
    "category": "mecanica",
    "description": "Suspensão traseira e alinhamento",
    "amountCents": 98000,
    "date": "2026-03-16",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-04-021.pdf"
  },
  {
    "id": "cost-022",
    "vehicleId": "veh-04",
    "category": "funilaria",
    "description": "Reparo de caçamba e pintura parcial",
    "amountCents": 62000,
    "date": "2026-03-31",
    "supplier": "NextPaint",
    "receiptUrl": "/mock/receipts/veh-04-022.pdf"
  },
  {
    "id": "cost-023",
    "vehicleId": "veh-04",
    "category": "pecas",
    "description": "Jogo de pneus",
    "amountCents": 68000,
    "date": "2026-04-04",
    "supplier": "nexTire",
    "receiptUrl": "/mock/receipts/veh-04-023.pdf"
  },
  {
    "id": "cost-024",
    "vehicleId": "veh-04",
    "category": "detail",
    "description": "Detail completo",
    "amountCents": 18000,
    "date": "2026-04-15",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-04-024.pdf"
  },
  {
    "id": "cost-025",
    "vehicleId": "veh-04",
    "category": "documentacao",
    "description": "Title e placa",
    "amountCents": 17500,
    "date": "2026-04-22",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-04-025.pdf"
  },
  {
    "id": "cost-026",
    "vehicleId": "veh-05",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 34000,
    "date": "2026-04-14",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-05-026.pdf"
  },
  {
    "id": "cost-027",
    "vehicleId": "veh-05",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 26000,
    "date": "2026-04-17",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-05-027.pdf"
  },
  {
    "id": "cost-028",
    "vehicleId": "veh-05",
    "category": "mecanica",
    "description": "Compressor do ar-condicionado",
    "amountCents": 52000,
    "date": "2026-04-28",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-05-028.pdf"
  },
  {
    "id": "cost-029",
    "vehicleId": "veh-05",
    "category": "detail",
    "description": "Detail completo",
    "amountCents": 19000,
    "date": "2026-05-17",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-05-029.pdf"
  },
  {
    "id": "cost-030",
    "vehicleId": "veh-05",
    "category": "documentacao",
    "description": "Title e placa",
    "amountCents": 17500,
    "date": "2026-05-23",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-05-030.pdf"
  },
  {
    "id": "cost-031",
    "vehicleId": "veh-06",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 41000,
    "date": "2026-02-24",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-06-031.pdf"
  },
  {
    "id": "cost-032",
    "vehicleId": "veh-06",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 19000,
    "date": "2026-02-26",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-06-032.pdf"
  },
  {
    "id": "cost-033",
    "vehicleId": "veh-06",
    "category": "mecanica",
    "description": "Vazamento de óleo e bomba d'água",
    "amountCents": 132000,
    "date": "2026-03-12",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-06-033.pdf"
  },
  {
    "id": "cost-034",
    "vehicleId": "veh-06",
    "category": "mecanica",
    "description": "Retrabalho — módulo eletrônico",
    "amountCents": 68000,
    "date": "2026-04-23",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-06-034.pdf"
  },
  {
    "id": "cost-035",
    "vehicleId": "veh-06",
    "category": "funilaria",
    "description": "Retoque de porta dianteira",
    "amountCents": 46000,
    "date": "2026-05-09",
    "supplier": "NextPaint",
    "receiptUrl": "/mock/receipts/veh-06-035.pdf"
  },
  {
    "id": "cost-036",
    "vehicleId": "veh-06",
    "category": "pecas",
    "description": "Jogo de pneus run-flat",
    "amountCents": 26000,
    "date": "2026-05-16",
    "supplier": "nexTire",
    "receiptUrl": "/mock/receipts/veh-06-036.pdf"
  },
  {
    "id": "cost-037",
    "vehicleId": "veh-06",
    "category": "detail",
    "description": "Detail completo",
    "amountCents": 22000,
    "date": "2026-06-22",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-06-037.pdf"
  },
  {
    "id": "cost-038",
    "vehicleId": "veh-06",
    "category": "documentacao",
    "description": "Title e placa",
    "amountCents": 18500,
    "date": "2026-06-30",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-06-038.pdf"
  },
  {
    "id": "cost-039",
    "vehicleId": "veh-07",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 44000,
    "date": "2026-07-28",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-07-039.pdf"
  },
  {
    "id": "cost-040",
    "vehicleId": "veh-07",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 19000,
    "date": "2026-07-30",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-07-040.pdf"
  },
  {
    "id": "cost-041",
    "vehicleId": "veh-07",
    "category": "mecanica",
    "description": "Revisão e freios",
    "amountCents": 74000,
    "date": "2026-08-05",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-07-041.pdf"
  },
  {
    "id": "cost-042",
    "vehicleId": "veh-07",
    "category": "detail",
    "description": "Detail completo",
    "amountCents": 24000,
    "date": "2026-08-13",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-07-042.pdf"
  },
  {
    "id": "cost-043",
    "vehicleId": "veh-07",
    "category": "documentacao",
    "description": "Title e placa",
    "amountCents": 18500,
    "date": "2026-08-18",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-07-043.pdf"
  },
  {
    "id": "cost-044",
    "vehicleId": "veh-08",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 38500,
    "date": "2026-08-12",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-08-044.pdf"
  },
  {
    "id": "cost-045",
    "vehicleId": "veh-08",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 18000,
    "date": "2026-08-14",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-08-045.pdf"
  },
  {
    "id": "cost-046",
    "vehicleId": "veh-08",
    "category": "mecanica",
    "description": "Revisão geral",
    "amountCents": 46000,
    "date": "2026-08-19",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-08-046.pdf"
  },
  {
    "id": "cost-047",
    "vehicleId": "veh-08",
    "category": "detail",
    "description": "Detail completo",
    "amountCents": 21000,
    "date": "2026-08-25",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-08-047.pdf"
  },
  {
    "id": "cost-048",
    "vehicleId": "veh-09",
    "category": "mecanica",
    "description": "Revisão e correia dentada",
    "amountCents": 88000,
    "date": "2026-08-07",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-09-048.pdf"
  },
  {
    "id": "cost-049",
    "vehicleId": "veh-09",
    "category": "funilaria",
    "description": "Retoque de paralama",
    "amountCents": 46000,
    "date": "2026-08-16",
    "supplier": "NextPaint",
    "receiptUrl": "/mock/receipts/veh-09-049.pdf"
  },
  {
    "id": "cost-050",
    "vehicleId": "veh-09",
    "category": "detail",
    "description": "Detail completo",
    "amountCents": 23000,
    "date": "2026-08-23",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-09-050.pdf"
  },
  {
    "id": "cost-051",
    "vehicleId": "veh-09",
    "category": "documentacao",
    "description": "Transferência de title",
    "amountCents": 17500,
    "date": "2026-08-28",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-09-051.pdf"
  },
  {
    "id": "cost-052",
    "vehicleId": "veh-10",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 44000,
    "date": "2026-05-19",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-10-052.pdf"
  },
  {
    "id": "cost-053",
    "vehicleId": "veh-10",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 31000,
    "date": "2026-05-22",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-10-053.pdf"
  },
  {
    "id": "cost-054",
    "vehicleId": "veh-10",
    "category": "mecanica",
    "description": "Bomba de combustível e velas",
    "amountCents": 132000,
    "date": "2026-05-31",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-10-054.pdf"
  },
  {
    "id": "cost-055",
    "vehicleId": "veh-10",
    "category": "funilaria",
    "description": "Repintura de capô",
    "amountCents": 78000,
    "date": "2026-06-22",
    "supplier": "NextPaint",
    "receiptUrl": "/mock/receipts/veh-10-055.pdf"
  },
  {
    "id": "cost-056",
    "vehicleId": "veh-10",
    "category": "pecas",
    "description": "Jogo de pneus",
    "amountCents": 84000,
    "date": "2026-07-05",
    "supplier": "nexTire",
    "receiptUrl": "/mock/receipts/veh-10-056.pdf"
  },
  {
    "id": "cost-057",
    "vehicleId": "veh-10",
    "category": "detail",
    "description": "Detail completo",
    "amountCents": 24000,
    "date": "2026-07-20",
    "supplier": "Detail Pro FL",
    "receiptUrl": "/mock/receipts/veh-10-057.pdf"
  },
  {
    "id": "cost-058",
    "vehicleId": "veh-10",
    "category": "documentacao",
    "description": "Title e placa",
    "amountCents": 18500,
    "date": "2026-07-26",
    "supplier": "Autotramites",
    "receiptUrl": "/mock/receipts/veh-10-058.pdf"
  },
  {
    "id": "cost-059",
    "vehicleId": "veh-11",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 52000,
    "date": "2026-08-29",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-11-059.pdf"
  },
  {
    "id": "cost-060",
    "vehicleId": "veh-11",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 19000,
    "date": "2026-08-31",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-11-060.pdf"
  },
  {
    "id": "cost-061",
    "vehicleId": "veh-11",
    "category": "mecanica",
    "description": "Diagnóstico e revisão inicial",
    "amountCents": 58000,
    "date": "2026-09-04",
    "supplier": "NextRepair",
    "receiptUrl": "/mock/receipts/veh-11-061.pdf"
  },
  {
    "id": "cost-062",
    "vehicleId": "veh-12",
    "category": "aquisicao_taxas",
    "description": "Taxas de aquisição do veículo",
    "amountCents": 37000,
    "date": "2026-09-02",
    "supplier": "CarNext",
    "receiptUrl": "/mock/receipts/veh-12-062.pdf"
  },
  {
    "id": "cost-063",
    "vehicleId": "veh-12",
    "category": "transporte",
    "description": "Transporte até o pátio",
    "amountCents": 18000,
    "date": "2026-09-04",
    "supplier": "Transportadora parceira",
    "receiptUrl": "/mock/receipts/veh-12-063.pdf"
  }
];
