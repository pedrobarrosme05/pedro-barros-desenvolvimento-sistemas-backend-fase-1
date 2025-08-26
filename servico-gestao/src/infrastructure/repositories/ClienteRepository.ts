import { Cliente } from '../../domain/entities/Cliente';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { Database } from '../database/Database';

/**
 * Implementação do repositório de clientes usando SQLite
 * Implementa o padrão Repository e princípio de Inversão de Dependência
 */
export class ClienteRepository implements IClienteRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAll(): Promise<Cliente[]> {
    const rows = await this.db.all('SELECT * FROM clientes ORDER BY nome');
    return rows.map(row => new Cliente(row.codigo, row.nome, row.email));
  }

  async findByCodigo(codigo: number): Promise<Cliente | null> {
    const row = await this.db.get('SELECT * FROM clientes WHERE codigo = ?', [codigo]);
    if (!row) return null;
    return new Cliente(row.codigo, row.nome, row.email);
  }

  async save(cliente: Cliente): Promise<Cliente> {
    await this.db.run(
      'INSERT INTO clientes (codigo, nome, email) VALUES (?, ?, ?)',
      [cliente.codigo, cliente.nome, cliente.email]
    );
    return cliente;
  }

  async update(cliente: Cliente): Promise<Cliente> {
    await this.db.run(
      'UPDATE clientes SET nome = ?, email = ? WHERE codigo = ?',
      [cliente.nome, cliente.email, cliente.codigo]
    );
    return cliente;
  }

  async delete(codigo: number): Promise<void> {
    await this.db.run('DELETE FROM clientes WHERE codigo = ?', [codigo]);
  }
}