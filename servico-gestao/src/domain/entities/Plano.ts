export class Plano {
  constructor(
    public codigo: number,
    public nome: string,
    public custoMensal: number,
    public data: Date,
    public descricao: string
  ) {}

  atualizarCustoMensal(novoCusto: number): void {
    this.custoMensal = novoCusto;
    this.data = new Date();
  }
}