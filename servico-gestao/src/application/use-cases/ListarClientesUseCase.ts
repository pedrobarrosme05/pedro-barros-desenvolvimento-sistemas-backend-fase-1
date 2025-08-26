import { Cliente } from '../../domain/entities/Cliente';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';

/**
 * Use case para listar todos os clientes
 * Implementa o princípio Single Responsibility - responsável apenas por listar clientes
 */
export class ListarClientesUseCase {
  constructor(private clienteRepository: IClienteRepository) {}

  async execute(): Promise<Cliente[]> {
    return await this.clienteRepository.findAll();
  }
}