import { Plano } from '../../domain/entities/Plano';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';

/**
 * Use case para listar todos os planos
 */
export class ListarPlanosUseCase {
  constructor(private planoRepository: IPlanoRepository) {}

  async execute(): Promise<Plano[]> {
    return await this.planoRepository.findAll();
  }
}