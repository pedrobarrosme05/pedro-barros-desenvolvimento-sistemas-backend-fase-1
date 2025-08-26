import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { AssinaturaResumoDTO } from '../../domain/dtos';

/**
 * Use case para listar assinaturas de um cliente específico
 */
export class ListarAssinaturasClienteUseCase {
  constructor(
    private assinaturaRepository: IAssinaturaRepository,
    private clienteRepository: IClienteRepository
  ) {}

  async execute(codCliente: number): Promise<AssinaturaResumoDTO[]> {
    // Validar se o cliente existe
    const cliente = await this.clienteRepository.findByCodigo(codCliente);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const assinaturas = await this.assinaturaRepository.findByCliente(codCliente);

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