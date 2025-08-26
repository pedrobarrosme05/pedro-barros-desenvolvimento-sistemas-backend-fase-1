import { Assinatura } from '../../domain/entities/Assinatura';
import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import { CriarAssinaturaDTO } from '../../domain/dtos';

/**
 * Use case para criar uma nova assinatura
 * Implementa validações de negócio e regras de fidelidade
 */
export class CriarAssinaturaUseCase {
  constructor(
    private assinaturaRepository: IAssinaturaRepository,
    private clienteRepository: IClienteRepository,
    private planoRepository: IPlanoRepository
  ) {}

  async execute(dados: CriarAssinaturaDTO): Promise<Assinatura> {
    // Validar se o cliente existe
    const cliente = await this.clienteRepository.findByCodigo(dados.codCliente);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    // Validar se o plano existe
    const plano = await this.planoRepository.findByCodigo(dados.codPlano);
    if (!plano) {
      throw new Error('Plano não encontrado');
    }

    // Validar dados de entrada
    if (dados.custoFinal <= 0) {
      throw new Error('Custo final deve ser maior que zero');
    }

    if (!dados.descricao || dados.descricao.trim().length === 0) {
      throw new Error('Descrição é obrigatória');
    }

    // Gerar código único para a assinatura
    const codigo = await this.assinaturaRepository.getNextCodigo();

    // Definir datas da assinatura
    const hoje = new Date();
    const fimFidelidade = new Date();
    fimFidelidade.setFullYear(fimFidelidade.getFullYear() + 1); // Fidelidade de 1 ano (365 dias)

    // Criar nova assinatura
    const novaAssinatura = new Assinatura(
      codigo,
      dados.codPlano,
      dados.codCliente,
      hoje,           // inicioFidelidade
      fimFidelidade,  // fimFidelidade (1 ano)
      hoje,           // dataUltimoPagamento (considera que o primeiro pagamento foi feito hoje)
      dados.custoFinal,
      dados.descricao
    );

    // Salvar assinatura
    return await this.assinaturaRepository.save(novaAssinatura);
  }
}