import { Plano } from '../entities/Plano';

/**
 * Interface para o repositório de planos
 * Define as operações que podem ser realizadas com planos
 */
export interface IPlanoRepository {
  findAll(): Promise<Plano[]>;
  findByCodigo(codigo: number): Promise<Plano | null>;
  save(plano: Plano): Promise<Plano>;
  update(plano: Plano): Promise<Plano>;
  delete(codigo: number): Promise<void>;
}