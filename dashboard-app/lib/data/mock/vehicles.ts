/* GERADO — dados fictícios de demonstração. Nenhum dado real de investidor.
   Veículos — a união discriminada garante que só 'vendido' tem resultado */

import type { Vehicle } from "../../types";

export const MOCK_VEHICLES: Vehicle[] = [
  {
    "id": "veh-01",
    "vin": "1C4RJFBG5MC742981",
    "year": 2021,
    "make": "Jeep",
    "model": "Grand Cherokee",
    "trim": "Limited",
    "mileage": 68420,
    "color": "Cinza granito",
    "purchaseDate": "2026-01-08",
    "photos": [
      "/mock/veh-01-1.svg",
      "/mock/veh-01-2.svg",
      "/mock/veh-01-3.svg"
    ],
    "acquisitionCostCents": 445000,
    "variableCostsCents": 180000,
    "landedCostCents": 625000,
    "askingPriceCents": 920000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-01-08"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-01-11"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-01-16"
      },
      {
        "label": "Anunciado",
        "date": "2026-01-28"
      },
      {
        "label": "Vendido",
        "date": "2026-02-19"
      }
    ],
    "status": "vendido",
    "daysInStock": 42,
    "salePriceCents": 880000,
    "saleDate": "2026-02-19",
    "grossProfitCents": 435000,
    "netProfitCents": 255000
  },
  {
    "id": "veh-02",
    "vin": "5NPE34AF4KH812203",
    "year": 2019,
    "make": "Hyundai",
    "model": "Sonata",
    "trim": "SEL",
    "mileage": 94210,
    "color": "Branco perolizado",
    "purchaseDate": "2026-01-22",
    "photos": [
      "/mock/veh-02-1.svg",
      "/mock/veh-02-2.svg",
      "/mock/veh-02-3.svg"
    ],
    "acquisitionCostCents": 352000,
    "variableCostsCents": 162000,
    "landedCostCents": 514000,
    "askingPriceCents": 759000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-01-22"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-01-25"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-01-30"
      },
      {
        "label": "Anunciado",
        "date": "2026-02-11"
      },
      {
        "label": "Vendido",
        "date": "2026-03-04"
      }
    ],
    "status": "vendido",
    "daysInStock": 41,
    "salePriceCents": 719000,
    "saleDate": "2026-03-04",
    "grossProfitCents": 367000,
    "netProfitCents": 205000
  },
  {
    "id": "veh-03",
    "vin": "2T1BURHE8JC998231",
    "year": 2020,
    "make": "Toyota",
    "model": "Corolla",
    "trim": "LE",
    "mileage": 71880,
    "color": "Prata",
    "purchaseDate": "2026-02-11",
    "photos": [
      "/mock/veh-03-1.svg",
      "/mock/veh-03-2.svg",
      "/mock/veh-03-3.svg"
    ],
    "acquisitionCostCents": 418000,
    "variableCostsCents": 155500,
    "landedCostCents": 573500,
    "askingPriceCents": 855000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-02-11"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-02-14"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-02-19"
      },
      {
        "label": "Anunciado",
        "date": "2026-03-03"
      },
      {
        "label": "Vendido",
        "date": "2026-03-27"
      }
    ],
    "status": "vendido",
    "daysInStock": 44,
    "salePriceCents": 815000,
    "saleDate": "2026-03-27",
    "grossProfitCents": 397000,
    "netProfitCents": 241500
  },
  {
    "id": "veh-04",
    "vin": "1FTEW1EP7JFA26610",
    "year": 2018,
    "make": "Ford",
    "model": "F-150",
    "trim": "XLT SuperCrew",
    "mileage": 118640,
    "color": "Azul metálico",
    "purchaseDate": "2026-03-05",
    "photos": [
      "/mock/veh-04-1.svg",
      "/mock/veh-04-2.svg",
      "/mock/veh-04-3.svg"
    ],
    "acquisitionCostCents": 692000,
    "variableCostsCents": 331500,
    "landedCostCents": 1023500,
    "askingPriceCents": 1370000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-03-05"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-03-08"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-03-13"
      },
      {
        "label": "Anunciado",
        "date": "2026-03-25"
      },
      {
        "label": "Vendido",
        "date": "2026-05-02"
      }
    ],
    "status": "vendido",
    "daysInStock": 58,
    "salePriceCents": 1330000,
    "saleDate": "2026-05-02",
    "grossProfitCents": 638000,
    "netProfitCents": 306500
  },
  {
    "id": "veh-05",
    "vin": "KNDPMCAC8L7712045",
    "year": 2020,
    "make": "Kia",
    "model": "Sportage",
    "trim": "LX",
    "mileage": 82330,
    "color": "Preto",
    "purchaseDate": "2026-04-14",
    "photos": [
      "/mock/veh-05-1.svg",
      "/mock/veh-05-2.svg",
      "/mock/veh-05-3.svg"
    ],
    "acquisitionCostCents": 468000,
    "variableCostsCents": 148500,
    "landedCostCents": 616500,
    "askingPriceCents": 902000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-04-14"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-04-17"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-04-22"
      },
      {
        "label": "Anunciado",
        "date": "2026-05-04"
      },
      {
        "label": "Vendido",
        "date": "2026-06-08"
      }
    ],
    "status": "vendido",
    "daysInStock": 55,
    "salePriceCents": 862000,
    "saleDate": "2026-06-08",
    "grossProfitCents": 394000,
    "netProfitCents": 245500
  },
  {
    "id": "veh-06",
    "vin": "WBA8E9C55GK646901",
    "year": 2016,
    "make": "BMW",
    "model": "328i",
    "trim": "Sport Line",
    "mileage": 132910,
    "color": "Branco alpino",
    "purchaseDate": "2026-02-24",
    "photos": [
      "/mock/veh-06-1.svg",
      "/mock/veh-06-2.svg",
      "/mock/veh-06-3.svg"
    ],
    "acquisitionCostCents": 586000,
    "variableCostsCents": 372500,
    "landedCostCents": 958500,
    "askingPriceCents": 913000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-02-24"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-02-27"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-03-04"
      },
      {
        "label": "Anunciado",
        "date": "2026-03-16"
      },
      {
        "label": "Vendido",
        "date": "2026-07-15"
      }
    ],
    "status": "vendido",
    "daysInStock": 141,
    "salePriceCents": 873000,
    "saleDate": "2026-07-15",
    "grossProfitCents": 287000,
    "netProfitCents": -85500
  },
  {
    "id": "veh-07",
    "vin": "2T3P1RFV8LC098772",
    "year": 2020,
    "make": "Toyota",
    "model": "RAV4",
    "trim": "XLE",
    "mileage": 76540,
    "color": "Cinza chumbo",
    "purchaseDate": "2026-07-28",
    "photos": [
      "/mock/veh-07-1.svg",
      "/mock/veh-07-2.svg",
      "/mock/veh-07-3.svg"
    ],
    "acquisitionCostCents": 646000,
    "variableCostsCents": 179500,
    "landedCostCents": 825500,
    "askingPriceCents": 1049000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-07-28"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-07-31"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-08-05"
      },
      {
        "label": "Anunciado",
        "date": "2026-08-21"
      }
    ],
    "status": "a_venda",
    "daysInStock": 43
  },
  {
    "id": "veh-08",
    "vin": "1N4BL4BV3LC212877",
    "year": 2020,
    "make": "Nissan",
    "model": "Altima",
    "trim": "SV",
    "mileage": 88120,
    "color": "Vermelho",
    "purchaseDate": "2026-08-12",
    "photos": [
      "/mock/veh-08-1.svg",
      "/mock/veh-08-2.svg",
      "/mock/veh-08-3.svg"
    ],
    "acquisitionCostCents": 486000,
    "variableCostsCents": 123500,
    "landedCostCents": 609500,
    "askingPriceCents": 812000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-08-12"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-08-15"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-08-20"
      },
      {
        "label": "Anunciado",
        "date": "2026-09-05"
      }
    ],
    "status": "a_venda",
    "daysInStock": 28
  },
  {
    "id": "veh-09",
    "vin": "3GNKBBRA6KS587412",
    "year": 2019,
    "make": "Chevrolet",
    "model": "Blazer",
    "trim": "LT",
    "mileage": 96780,
    "color": "Preto",
    "purchaseDate": "2026-08-01",
    "photos": [
      "/mock/veh-09-1.svg",
      "/mock/veh-09-2.svg",
      "/mock/veh-09-3.svg"
    ],
    "acquisitionCostCents": 528000,
    "variableCostsCents": 174500,
    "landedCostCents": 702500,
    "askingPriceCents": 938000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-08-01"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-08-04"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-08-09"
      },
      {
        "label": "Anunciado",
        "date": "2026-08-25"
      }
    ],
    "status": "a_venda",
    "daysInStock": 39
  },
  {
    "id": "veh-10",
    "vin": "JTMRFREV8HD214506",
    "year": 2017,
    "make": "Toyota",
    "model": "Highlander",
    "trim": "SE",
    "mileage": 141220,
    "color": "Bronze",
    "purchaseDate": "2026-05-19",
    "photos": [
      "/mock/veh-10-1.svg",
      "/mock/veh-10-2.svg",
      "/mock/veh-10-3.svg"
    ],
    "acquisitionCostCents": 572000,
    "variableCostsCents": 411500,
    "landedCostCents": 983500,
    "askingPriceCents": 1098000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-05-19"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-05-22"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-05-27"
      },
      {
        "label": "Anunciado",
        "date": "2026-06-12"
      }
    ],
    "status": "a_venda",
    "daysInStock": 113
  },
  {
    "id": "veh-11",
    "vin": "5FNRL6H79MB025913",
    "year": 2021,
    "make": "Honda",
    "model": "Odyssey",
    "trim": "EX-L",
    "mileage": 79340,
    "color": "Prata lunar",
    "purchaseDate": "2026-08-29",
    "photos": [
      "/mock/veh-11-1.svg",
      "/mock/veh-11-2.svg",
      "/mock/veh-11-3.svg"
    ],
    "acquisitionCostCents": 742000,
    "variableCostsCents": 129000,
    "landedCostCents": 871000,
    "askingPriceCents": 1198000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-08-29"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-09-01"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-09-06"
      }
    ],
    "status": "em_preparo",
    "daysInStock": 11
  },
  {
    "id": "veh-12",
    "vin": "1G1ZD5ST2LF061334",
    "year": 2020,
    "make": "Chevrolet",
    "model": "Malibu",
    "trim": "LT",
    "mileage": 91450,
    "color": "Cinza",
    "purchaseDate": "2026-09-02",
    "photos": [
      "/mock/veh-12-1.svg",
      "/mock/veh-12-2.svg",
      "/mock/veh-12-3.svg"
    ],
    "acquisitionCostCents": 452000,
    "variableCostsCents": 55000,
    "landedCostCents": 507000,
    "askingPriceCents": 698000,
    "timeline": [
      {
        "label": "Veículo adquirido",
        "date": "2026-09-02"
      },
      {
        "label": "Chegou ao pátio",
        "date": "2026-09-05"
      },
      {
        "label": "Serviços de preparação",
        "date": "2026-09-10"
      }
    ],
    "status": "em_preparo",
    "daysInStock": 7
  }
];
