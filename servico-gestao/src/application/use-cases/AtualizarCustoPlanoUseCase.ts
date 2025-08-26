import { Plano } from '../../domain/entities/Plano';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import { AtualizarCustoPlanoDTO } from '../../domain/dtos';

/**
 * Use case para atualizar o custo mensal de um plano
 * Implementa o princípio Open/Closed - aberto para extensão, fechado para modificação
 */
export class AtualizarCustoPlanoUseCase {
  constructor(private planoRepository: IPlanoRepository) {}

  async execute(idPlano: number, dados: AtualizarCustoPlanoDTO): Promise<Plano> {
    // Buscar o plano
    const plano = await this.planoRepository.findByCodigo(idPlano);
    if (!plano) {
      throw new Error('Plano não encontrado');
    }

    // Validar se o custo é válido
    if (dados.custoMensal <= 0) {
      throw new Error('Custo mensal deve ser maior que zero');
    }

    // Atualizar o custo mensal (método da entidade)
    plano.atualizarCustoMensal(dados.custoMensal);

    // Salvar as alterações
    return await this.planoRepository.update(plano);
  }
}