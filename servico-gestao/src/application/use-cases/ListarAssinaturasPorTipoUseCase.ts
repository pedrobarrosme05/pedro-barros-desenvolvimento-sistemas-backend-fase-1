import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { AssinaturaResumoDTO, TipoAssinatura } from '../../domain/dtos';

/**
 * Use case para listar assinaturas por tipo (TODOS, ATIVOS, CANCELADOS)
 */
export class ListarAssinaturasPorTipoUseCase {
  constructor(private assinaturaRepository: IAssinaturaRepository) {}

  async execute(tipo: TipoAssinatura): Promise<AssinaturaResumoDTO[]> {
    let assinaturas;

    switch (tipo) {
      case TipoAssinatura.ATIVOS:
        assinaturas = await this.assinaturaRepository.findByStatus(true);
        break;
      case TipoAssinatura.CANCELADOS:
        assinaturas = await this.assinaturaRepository.findByStatus(false);
        break;
      case TipoAssinatura.TODOS:
      default:
        assinaturas = await this.assinaturaRepository.findAll();
        break;
    }

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