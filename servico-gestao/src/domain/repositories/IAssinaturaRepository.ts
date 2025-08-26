import { Assinatura } from '../entities/Assinatura';

/**
 * Interface para o repositório de assinaturas
 * Define as operações que podem ser realizadas com assinaturas
 */
export interface IAssinaturaRepository {
  findAll(): Promise<Assinatura[]>;
  findByCodigo(codigo: number): Promise<Assinatura | null>;
  findByCliente(codCliente: number): Promise<Assinatura[]>;
  findByPlano(codPlano: number): Promise<Assinatura[]>;
  findByStatus(ativo: boolean): Promise<Assinatura[]>;
  save(assinatura: Assinatura): Promise<Assinatura>;
  update(assinatura: Assinatura): Promise<Assinatura>;
  delete(codigo: number): Promise<void>;
  getNextCodigo(): Promise<number>;
}