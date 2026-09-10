/**
 * Textos de conformidade, centralizados.
 *
 * Toda frase que descreve o direito do investidor, o evento que gera pagamento
 * ou a natureza de um número mora AQUI — para que a revisão de linguagem seja
 * a leitura de um arquivo, e não uma caçada por 30 componentes.
 *
 * Regras que estes textos materializam:
 *  · nenhuma projeção, estimativa ou simulação de retorno futuro;
 *  · nenhum prazo de venda, de pagamento ou de devolução de capital;
 *  · nenhum resultado exibido para veículo não vendido;
 *  · nada de "garantido", "renda", "rentabilidade", "investimento com retorno".
 */

/** Rótulo canônico do direito do investidor. Usar sempre este. */
export const RIGHT_LABEL = "30% do lucro líquido do veículo, devido apenas na venda";

/** Nota obrigatória sob qualquer histórico agregado. */
export const PAST_RESULTS_NOTE =
  "Resultados passados de veículos já vendidos. Não representam previsão nem garantia de resultado futuro.";

/** Rodapé fixo do portal do investidor. */
export const PORTAL_FOOTER =
  "O pagamento ocorre exclusivamente quando o veículo é vendido. Não há promessa de prazo, de valor ou de rendimento. Existe risco de prejuízo.";

/** Encerramento da cascata financeira de veículo em estoque. */
export const RESULT_ON_SALE_ONLY = "Resultado apurado somente na venda";

/** Espaço do card de veículo não vendido, onde o vendido mostra lucro. */
export const CARD_RESULT_PLACEHOLDER = "Resultado apurado na venda";

/** Resumo do que o investidor está solicitando, acima do botão de envio. */
export const REQUEST_SUMMARY = [
  "O capital é alocado a veículos específicos, identificados por VIN.",
  "O direito é de 30% do lucro líquido de cada veículo, pro-rata da sua participação naquele carro.",
  "O pagamento é devido apenas quando aquele veículo específico for vendido.",
  "Não há prazo, valor ou rendimento prometidos.",
  "Se o veículo não vender, não há pagamento. Se vender com prejuízo, não há lucro a distribuir.",
  "O contrato tem vigência de 1 ano — que é a vigência do acordo, não um prazo de pagamento.",
];

/** Marcador de pendência jurídica, renderizado visivelmente no protótipo. */
export const TODO_CONTRACT =
  "TODO: CONFIRMAR — redação sujeita aos termos do contrato investidor-por-veículo, ainda não fornecido.";

export interface FaqItem {
  q: string;
  a: string[];
  /** true → exibe a tarja de pendência contratual. */
  pendingContract?: boolean;
}

export const FAQ: FaqItem[] = [
  {
    q: "Como o lucro é calculado?",
    a: [
      "O lucro líquido de um veículo é o preço de venda menos o custo final daquele veículo. O custo final é o preço de aquisição somado a todos os custos variáveis lançados naquele VIN: taxas de aquisição, transporte, mecânica, funilaria, detail, peças e documentação.",
      "Desse lucro líquido, 30% cabe ao conjunto de investidores do veículo e 70% fica com a empresa. Os 30% são rateados entre os investidores daquele carro na proporção do capital que cada um alocou nele.",
      "Todos os custos lançados ficam visíveis na tela do veículo, item a item, com data, fornecedor e comprovante.",
    ],
  },
  {
    q: "Quando eu recebo?",
    a: [
      "Exclusivamente quando aquele veículo específico for vendido. O pagamento é um evento ligado à venda de cada carro, não a uma data.",
      "Não há data prevista, prazo garantido ou periodicidade. Cada veículo é um caso próprio: enquanto ele estiver em estoque, não há valor apurado nem devido.",
    ],
  },
  {
    q: "E se o carro não vender?",
    a: [
      "Não há pagamento enquanto não houver venda. O capital permanece alocado ao veículo e aparece no seu portal como capital alocado, não como valor a receber.",
      "Veículos com muito tempo em estoque continuam listados no seu portal com o tempo real de estoque, sem qualquer estimativa de quando serão vendidos.",
    ],
  },
  {
    q: "E se vender com prejuízo?",
    a: [
      "Se o preço de venda for menor que o custo final do veículo, não há lucro líquido e, portanto, não há distribuição. O direito do investidor incide sobre lucro; sem lucro, não há valor a pagar.",
      "O prejuízo é exibido no portal com o mesmo destaque do lucro, na tela do veículo e no seu extrato.",
      "A forma como o prejuízo afeta o capital alocado — se é absorvido pela empresa, se reduz o principal do investidor, ou se é compensado em operações seguintes — é definida em contrato.",
    ],
    pendingContract: true,
  },
  {
    q: "Existe rendimento garantido?",
    a: [
      "Não. Não há promessa de rendimento, de prazo nem de valor.",
      "O portal não exibe projeção, simulação ou estimativa de retorno em nenhuma tela. Os números apresentados são sempre de operações já realizadas, e resultado passado não indica resultado futuro.",
      "Existe risco de prejuízo.",
    ],
  },
  {
    q: "Posso retirar meu capital antes?",
    a: [
      "Capital já alocado a um veículo permanece vinculado àquele veículo até que ele seja vendido. Não há liquidez nem resgate antecipado sobre capital alocado.",
      "Capital disponível — aportado e ainda não alocado a nenhum VIN — segue regra própria de devolução.",
      "As condições exatas de saída, incluindo aviso prévio e tratamento do capital alocado, constam do contrato.",
    ],
    pendingContract: true,
  },
  {
    q: "Quem paga a manutenção e a preparação do veículo?",
    a: [
      "Todos os custos de preparação são lançados no próprio veículo e compõem o custo final: taxas de aquisição, transporte, mecânica, funilaria, detail, peças e documentação.",
      "Como o lucro líquido é apurado depois desses custos, eles reduzem a base sobre a qual os 30% são calculados. Por isso cada lançamento fica visível para o investidor, com comprovante.",
      "A divisão entre custo do veículo e custo operacional fixo da empresa — aluguel, folha, licenças — está detalhada no contrato.",
    ],
    pendingContract: true,
  },
  {
    q: "Quem escolhe os carros?",
    a: [
      "A seleção e a compra são feitas pela CarNext, com base em histórico do modelo, condição mecânica, custo de preparação e liquidez do veículo na região.",
      "O investidor não escolhe o veículo, mas vê exatamente em quais VINs seu capital foi alocado, com ficha completa, fotos, custos e histórico.",
      "Os canais e fornecedores de aquisição são informação comercial da CarNext e não são divulgados. Isso não afeta a transparência do resultado: o preço de aquisição de cada veículo aparece integralmente na cascata de custos.",
    ],
  },
  {
    q: "O que é aging?",
    a: [
      "Aging é o número de dias corridos entre a compra do veículo e hoje — ou, para veículos já vendidos, entre a compra e a venda.",
      "Serve para acompanhar quanto tempo o capital está imobilizado em cada carro. É um dado observado, não uma meta nem uma previsão de quando o veículo será vendido.",
      "No portal, veículos com mais de 60 dias em estoque recebem destaque visual — como informação operacional, não como alerta de pagamento.",
    ],
  },
  {
    q: "Como acompanho meu capital?",
    a: [
      "A visão geral mostra quanto você aportou, quanto está alocado em veículos, quanto está disponível e quanto já foi distribuído em lucro realizado de veículos vendidos.",
      "A tela de cada veículo mostra a cascata completa de custos e a sua participação naquele carro. O extrato lista todos os movimentos — aportes, alocações, devoluções e distribuições — com referência bancária e exportação em CSV.",
    ],
  },
  {
    q: "Como funciona a renovação da vigência do contrato?",
    a: [
      "O contrato tem vigência de 1 ano. Vigência é o período em que o acordo está em vigor; não é prazo de pagamento nem data de devolução de capital.",
      "Veículos alocados dentro da vigência seguem regidos por ela até a venda.",
      "As condições de renovação, encerramento e o tratamento de alocações em aberto ao fim da vigência constam do contrato.",
    ],
    pendingContract: true,
  },
];
