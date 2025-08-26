import { Plano } from '../../domain/entities/Plano';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import { Database } from '../database/Database';

/**
 * Implementação do repositório de planos usando SQLite
 */
export class PlanoRepository implements IPlanoRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAll(): Promise<Plano[]> {
    const rows = await this.db.all('SELECT * FROM planos ORDER BY nome');
    return rows.map(row => new Plano(
      row.codigo,
      row.nome,
      row.custoMensal,
      new Date(row.data),
      row.descricao
    ));
  }

  async findByCodigo(codigo: number): Promise<Plano | null> {
    const row = await this.db.get('SELECT * FROM planos WHERE codigo = ?', [codigo]);
    if (!row) return null;
    return new Plano(
      row.codigo,
      row.nome,
      row.custoMensal,
      new Date(row.data),
      row.descricao
    );
  }

  async save(plano: Plano): Promise<Plano> {
    await this.db.run(
      'INSERT INTO planos (codigo, nome, custoMensal, data, descricao) VALUES (?, ?, ?, ?, ?)',
      [plano.codigo, plano.nome, plano.custoMensal, plano.data.toISOString(), plano.descricao]
    );
    return plano;
  }

  async update(plano: Plano): Promise<Plano> {
    await this.db.run(
      'UPDATE planos SET nome = ?, custoMensal = ?, data = ?, descricao = ? WHERE codigo = ?',
      [plano.nome, plano.custoMensal, plano.data.toISOString(), plano.descricao, plano.codigo]
    );
    return plano;
  }

  async delete(codigo: number): Promise<void> {
    await this.db.run('DELETE FROM planos WHERE codigo = ?', [codigo]);
  }
}