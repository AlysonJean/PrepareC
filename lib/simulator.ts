export interface SimulationParams {
  faturamentoMensal: number;
  regimeAtual: "SIMPLES" | "LUCRO_PRESUMIDO" | "LUCRO_REAL";
  setor: "SERVICOS" | "COMERCIO" | "INDUSTRIA";
  custoInsumosPerc: number; // Porcentagem do faturamento gasta em insumos que dão crédito
  folhaPagamentoPerc: number; // Porcentagem do faturamento gasta com folha (não dá crédito)
  saldoCredorObtido?: number; // Saldo de ICMS/IPI não utilizado que poderá ser amortizado
  percentualVendasB2B?: number; // Vendas para pessoas jurídicas (B2B) para cálculo do Simples Híbrido
}

export interface SimulationResult {
  cargaAtualCalc: number;
  cargaAtualPerc: number;

  // IBS/CBS parameters
  aliquotaReferenciaIBSCBS: number; // estimado ~26.5% a 27.9%
  creditosIBSCBS: number;
  cargaFuturaCalc: number;
  cargaFuturaPerc: number;

  impactoMensal: number;
  impactoPercentual: number;
  isAumento: boolean;

  // Dores e Diferenciais Competitivos
  custoOportunidadeCreditoB2B: number; // Crédito que o Simples deixa de repassar se ficar fora do Híbrido
  splitPaymentImpact: number; // Valor retido na fonte que não passa no fluxo de caixa (Split Payment)
  sugestaoAumentoPreco: number; // Porcentagem necessária de reajuste de preço para empatar a margem

  // Timeline de Transição (8 anos)
  timeline: Array<{
    year: number;
    cargaAtual: number; // valor base antigo
    cargaProjetada: number; // valor misto para aquele ano (transição)
  }>;
}

// Estimativas simplificadas
const ALIQUOTA_REF_IBS_CBS = 0.265; // 26.5%

export function calculateTaxImpact(params: SimulationParams): SimulationResult {
  const {
    faturamentoMensal,
    regimeAtual,
    setor,
    custoInsumosPerc,
    // folhaPagamentoPerc, // (não possui crédito)
    saldoCredorObtido = 0,
    percentualVendasB2B = 0,
  } = params;

  let cargaAtualPerc = 0;

  // Regras genéricas do sistema atual (muito simplificadas para o MVP do Simulador)
  if (regimeAtual === "SIMPLES") {
    if (setor === "COMERCIO") cargaAtualPerc = 0.08;
    else if (setor === "INDUSTRIA") cargaAtualPerc = 0.09;
    else cargaAtualPerc = 0.12; // Servicos
  } else if (regimeAtual === "LUCRO_PRESUMIDO") {
    if (setor === "SERVICOS")
      cargaAtualPerc = 0.1633; // PIS/COFINS (3.65) + ISS (~5) + CSLL/IRPJ
    else cargaAtualPerc = 0.12; // Menor peso base
  } else {
    // Lucro Real
    if (setor === "SERVICOS")
      cargaAtualPerc = 0.18; // PIS/COFINS (9.25 não cumulativo mas serviço tem pouco credito)
    else cargaAtualPerc = 0.08; // Industria/Comercio tomam muito credito
  }

  const cargaAtualCalc = faturamentoMensal * cargaAtualPerc;

  // Cálculo IBS/CBS
  // Débito = Faturamento * Alíquota Referência
  const debitoIBSCBS = faturamentoMensal * ALIQUOTA_REF_IBS_CBS;

  // Crédito = Insumos comprados * Alíquota Referência (IVA não cumulativo pleno)
  const valorInsumos = faturamentoMensal * (custoInsumosPerc / 100);
  const creditosIBSCBS = valorInsumos * ALIQUOTA_REF_IBS_CBS;

  // A folha de pagamento não gera crédito de IBS/CBS.

  // Custo real do tributo: Débito menos Crédito
  const cargaFuturaCalc = debitoIBSCBS - creditosIBSCBS;
  const cargaFuturaPerc = cargaFuturaCalc / faturamentoMensal;

  const impactoMensal = cargaFuturaCalc - cargaAtualCalc;
  const isAumento = impactoMensal > 0;
  const impactoPercentual = impactoMensal / (cargaAtualCalc || 1);

  // 1. Diferencial: Custo de Oportunidade do Simples Nacional (Credito B2B)
  // Se ele é Simples e não optar pelo IBS/CBS "por fora" (Regime Híbrido), seus clientes B2B 
  // recebem um crédito irrisório (só a fatia do imposto no DAS). 
  // Se optar pelo Híbrido, repassa a alíquota cheia (ALIQUOTA_REF_IBS_CBS).
  // Esse é o valor/poder de arguição comercial que ele perde se NÃO for pro híbrido:
  let custoOportunidadeCreditoB2B = 0;
  if (regimeAtual === "SIMPLES" && percentualVendasB2B > 0) {
    const faturamentoB2B = faturamentoMensal * (percentualVendasB2B / 100);
    custoOportunidadeCreditoB2B = faturamentoB2B * ALIQUOTA_REF_IBS_CBS;
  }

  // 2. Diferencial: Alerta de Fluxo de Caixa (Split Payment)
  // Quase 100% do IBS/CBS apurado em cada nota (Débito Base bruto antes de abater insumo mensal) 
  // será retido na hora pela maquininha ou PIX. Isso reduz a entrada de caixa "suja" (faturamento na veia).
  const splitPaymentImpact = debitoIBSCBS; // É o valor que deixa de circular na conta do empresário mensalmente

  // 3. Diferencial: Sugestão de Repasse de Preços (Pricing)
  // Para manter a mesma margem absoluta em reais, o empresário precisa subir o preço equivalente
  // à subida bruta da porcentagem da carga. Ex: pagava 10%, vai pagar 15% -> sobe 5% no preço.
  let sugestaoAumentoPreco = 0;
  if (isAumento) {
    sugestaoAumentoPreco = (cargaFuturaPerc * 100) - (cargaAtualPerc * 100);
  }

  // Geração da Timeline (Projeção da Carga Mensal em cada ano da transição)
  // Pesos aproximados do Sistema Antigo vs Novo
  const transitionWeights = [
    { year: 2026, oldWeight: 1.0, newWeight: 0.0 }, // Teste 1% (abatido do PIS/COFINS)
    { year: 2027, oldWeight: 0.65, newWeight: 0.35 }, // Extinção PIS/Cofins, entrada CBS
    { year: 2028, oldWeight: 0.65, newWeight: 0.35 },
    { year: 2029, oldWeight: 0.55, newWeight: 0.45 }, // ICMS/ISS reduzem 10%
    { year: 2030, oldWeight: 0.45, newWeight: 0.55 },
    { year: 2031, oldWeight: 0.30, newWeight: 0.70 },
    { year: 2032, oldWeight: 0.15, newWeight: 0.85 },
    { year: 2033, oldWeight: 0.0, newWeight: 1.0 }, // IVA Pleno
  ];

  // Desconto mensal do Saldo Credor. Lei diz: aproveitamento em 240 meses (20 anos) ou compensação de IBS/CBS a partir de 2033 (ou antes no ICMS).
  // Para a simulação MVP de impacto mensal, vamos dividir o saldo por 240 e bater na carga final se houver.
  const descontoMensalSaldoCredor = saldoCredorObtido / 240;

  const timeline = transitionWeights.map(({ year, oldWeight, newWeight }) => {
    // A carga projetada mescla o cenário antigo e o novo
    let cargaProjetadaAno = (cargaAtualCalc * oldWeight) + (cargaFuturaCalc * newWeight);
    
    // Desconta a amortização do saldo credor, limitando para não ficar negativo
    if (descontoMensalSaldoCredor > 0) {
        cargaProjetadaAno = Math.max(0, cargaProjetadaAno - descontoMensalSaldoCredor);
    }

    return {
      year,
      cargaAtual: cargaAtualCalc, // Mantém a linha de base para visualização de "O que seria seu imposto"
      cargaProjetada: cargaProjetadaAno
    };
  });

  return {
    cargaAtualCalc,
    cargaAtualPerc: cargaAtualPerc * 100,
    aliquotaReferenciaIBSCBS: ALIQUOTA_REF_IBS_CBS * 100,
    creditosIBSCBS,
    cargaFuturaCalc,
    cargaFuturaPerc: cargaFuturaPerc * 100,
    impactoMensal: Math.abs(impactoMensal),
    impactoPercentual: Math.abs(impactoPercentual) * 100,
    isAumento,
    custoOportunidadeCreditoB2B,
    splitPaymentImpact,
    sugestaoAumentoPreco,
    timeline,
  };
}
