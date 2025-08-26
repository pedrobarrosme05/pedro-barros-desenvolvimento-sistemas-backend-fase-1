/**
 * Enum para status da assinatura
 */
export enum StatusAssinatura {
  ATIVO = 'ATIVO',
  CANCELADO = 'CANCELADO'
}

/**
 * Entidade Assinatura - modela a relação entre um plano e um cliente
 */
export class Assinatura {
  constructor(
    public codigo: number,
    public codPlano: number,
    public codCli: number,
    public inicioFidelidade: Date,
    public fimFidelidade: Date,
    public dataUltimoPagamento: Date,
    public custoFinal: number,
    public descricao: string
  ) {}

  /**
   * Verifica se a assinatura está ativa
   * Uma assinatura está ativa se:
   * - A data atual está entre início e fim da fidelidade
   * - O último pagamento foi feito há no máximo 30 dias
   */
  isAtiva(): boolean {
    const hoje = new Date();
    const dataLimite = new Date(this.dataUltimoPagamento);
    dataLimite.setDate(dataLimite.getDate() + 30);

    return hoje >= this.inicioFidelidade && 
           hoje <= this.fimFidelidade && 
           hoje <= dataLimite;
  }

  /**
   * Retorna o status da assinatura
   */
  getStatus(): StatusAssinatura {
    return this.isAtiva() ? StatusAssinatura.ATIVO : StatusAssinatura.CANCELADO;
  }

  /**
   * Atualiza a data do último pagamento
   */
  atualizarPagamento(dataPagamento: Date): void {
    this.dataUltimoPagamento = dataPagamento;
  }

  /**
   * Atualiza o período de fidelidade
   */
  atualizarFidelidade(novoFim: Date, novoCusto: number, novaDescricao: string): void {
    this.fimFidelidade = novoFim;
    this.custoFinal = novoCusto;
    this.descricao = novaDescricao;
  }
}