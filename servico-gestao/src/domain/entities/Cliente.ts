/**
 * Entidade Cliente - representa uma pessoa interessada em assinar os planos
 */
export class Cliente {
  constructor(
    public codigo: number,
    public nome: string,
    public email: string
  ) {}
}