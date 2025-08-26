import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import { AssinaturaResumoDTO } from '../../domain/dtos';

/**
 * Use case para listar assinaturas de um plano específico
 */
export class ListarAssinaturasPlanoUseCase {
  constructor(
    private assinaturaRepository: IAssinaturaRepository,
    private planoRepository: IPlanoRepository
  ) {}

  async execute(codPlano: number): Promise<AssinaturaResumoDTO[]> {
    // Validar se o plano existe
    const plano = await this.planoRepository.findByCodigo(codPlano);
    if (!plano) {
      throw new Error('Plano não encontrado');
    }

    const assinaturas = await this.assinaturaRepository.findByPlano(codPlano);

    // Converter para DTO de resposta
    return assinaturas.map(assinatura => ({
      codigoAssinatura: assinatura.codigo,
      codigoCliente: assinatura.codCli,
      codigoPlano: assinatura.codPlano,
      dataInicio: assinatura.inicioFidelidade,
      dataFim: assinatura.fimFidelidade,
      status: assinatura.getStatus()
    }));
  }
}