import { Cliente } from '../entities/Cliente';

/**
 * Interface para o repositório de clientes
 * Define as operações que podem ser realizadas com clientes
 */
export interface IClienteRepository {
  findAll(): Promise<Cliente[]>;
  findByCodigo(codigo: number): Promise<Cliente | null>;
  save(cliente: Cliente): Promise<Cliente>;
  update(cliente: Cliente): Promise<Cliente>;
  delete(codigo: number): Promise<void>;
}