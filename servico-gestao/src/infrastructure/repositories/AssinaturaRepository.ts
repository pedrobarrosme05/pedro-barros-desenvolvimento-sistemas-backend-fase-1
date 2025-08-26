import { Assinatura } from '../../domain/entities/Assinatura';
import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { Database } from '../database/Database';

/**
 * Implementação do repositório de assinaturas usando SQLite
 */
export class AssinaturaRepository implements IAssinaturaRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAll(): Promise<Assinatura[]> {
    const rows = await this.db.all('SELECT * FROM assinaturas ORDER BY codigo');
    return rows.map(row => this.mapRowToAssinatura(row));
  }

  async findByCodigo(codigo: number): Promise<Assinatura | null> {
    const row = await this.db.get('SELECT * FROM assinaturas WHERE codigo = ?', [codigo]);
    if (!row) return null;
    return this.mapRowToAssinatura(row);
  }

  async findByCliente(codCliente: number): Promise<Assinatura[]> {
    const rows = await this.db.all('SELECT * FROM assinaturas WHERE codCli = ? ORDER BY codigo', [codCliente]);
    return rows.map(row => this.mapRowToAssinatura(row));
  }

  async findByPlano(codPlano: number): Promise<Assinatura[]> {
    const rows = await this.db.all('SELECT * FROM assinaturas WHERE codPlano = ? ORDER BY codigo', [codPlano]);
    return rows.map(row => this.mapRowToAssinatura(row));
  }

  async findByStatus(ativo: boolean): Promise<Assinatura[]> {
    const todas = await this.findAll();
    return todas.filter(assinatura => assinatura.isAtiva() === ativo);
  }

  async save(assinatura: Assinatura): Promise<Assinatura> {
    await this.db.run(
      `INSERT INTO assinaturas 
       (codigo, codPlano, codCli, inicioFidelidade, fimFidelidade, dataUltimoPagamento, custoFinal, descricao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        assinatura.codigo,
        assinatura.codPlano,
        assinatura.codCli,
        assinatura.inicioFidelidade.toISOString(),
        assinatura.fimFidelidade.toISOString(),
        assinatura.dataUltimoPagamento.toISOString(),
        assinatura.custoFinal,
        assinatura.descricao
      ]
    );
    return assinatura;
  }

  async update(assinatura: Assinatura): Promise<Assinatura> {
    await this.db.run(
      `UPDATE assinaturas SET 
       codPlano = ?, codCli = ?, inicioFidelidade = ?, fimFidelidade = ?, 
       dataUltimoPagamento = ?, custoFinal = ?, descricao = ? 
       WHERE codigo = ?`,
      [
        assinatura.codPlano,
        assinatura.codCli,
        assinatura.inicioFidelidade.toISOString(),
        assinatura.fimFidelidade.toISOString(),
        assinatura.dataUltimoPagamento.toISOString(),
        assinatura.custoFinal,
        assinatura.descricao,
        assinatura.codigo
      ]
    );
    return assinatura;
  }

  async delete(codigo: number): Promise<void> {
    await this.db.run('DELETE FROM assinaturas WHERE codigo = ?', [codigo]);
  }

  async getNextCodigo(): Promise<number> {
    const row = await this.db.get('SELECT MAX(codigo) as maxCodigo FROM assinaturas');
    return (row?.maxCodigo || 0) + 1;
  }

  private mapRowToAssinatura(row: any): Assinatura {
    return new Assinatura(
      row.codigo,
      row.codPlano,
      row.codCli,
      new Date(row.inicioFidelidade),
      new Date(row.fimFidelidade),
      new Date(row.dataUltimoPagamento),
      row.custoFinal,
      row.descricao
    );
  }
}