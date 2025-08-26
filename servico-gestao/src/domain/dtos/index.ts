/**
 * DTO para criação de assinatura
 */
export interface CriarAssinaturaDTO {
  codCliente: number;
  codPlano: number;
  custoFinal: number;
  descricao: string;
}

/**
 * DTO para atualização de custo mensal do plano
 */
export interface AtualizarCustoPlanoDTO {
  custoMensal: number;
}

/**
 * DTO para resposta de assinatura resumida
 */
export interface AssinaturaResumoDTO {
  codigoAssinatura: number;
  codigoCliente: number;
  codigoPlano: number;
  dataInicio: Date;
  dataFim: Date;
  status: string;
}

/**
 * Enum para tipos de filtro de assinatura
 */
export enum TipoAssinatura {
  TODOS = 'TODOS',
  ATIVOS = 'ATIVOS',
  CANCELADOS = 'CANCELADOS'
}