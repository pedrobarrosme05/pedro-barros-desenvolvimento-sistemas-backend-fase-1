import { Request, Response } from 'express';
import { ListarClientesUseCase } from '../../application/use-cases/ListarClientesUseCase';
import { ListarPlanosUseCase } from '../../application/use-cases/ListarPlanosUseCase';
import { CriarAssinaturaUseCase } from '../../application/use-cases/CriarAssinaturaUseCase';
import { AtualizarCustoPlanoUseCase } from '../../application/use-cases/AtualizarCustoPlanoUseCase';
import { ListarAssinaturasPorTipoUseCase } from '../../application/use-cases/ListarAssinaturasPorTipoUseCase';
import { ListarAssinaturasClienteUseCase } from '../../application/use-cases/ListarAssinaturasClienteUseCase';
import { ListarAssinaturasPlanoUseCase } from '../../application/use-cases/ListarAssinaturasPlanoUseCase';
import { TipoAssinatura } from '../../domain/dtos';

/**
 * Controller principal do ServicoGestao
 * Implementa o padrão MVC e princípios da Arquitetura Limpa
 */
export class GestaoController {
  constructor(
    private listarClientesUseCase: ListarClientesUseCase,
    private listarPlanosUseCase: ListarPlanosUseCase,
    private criarAssinaturaUseCase: CriarAssinaturaUseCase,
    private atualizarCustoPlanoUseCase: AtualizarCustoPlanoUseCase,
    private listarAssinaturasPorTipoUseCase: ListarAssinaturasPorTipoUseCase,
    private listarAssinaturasClienteUseCase: ListarAssinaturasClienteUseCase,
    private listarAssinaturasPlanoUseCase: ListarAssinaturasPlanoUseCase
  ) {}

  /**
   * GET /gestao/clientes
   * Lista todos os clientes cadastrados
   */
  public listarClientes = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientes = await this.listarClientesUseCase.execute();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * GET /gestao/planos
   * Lista todos os planos cadastrados
   */
  public listarPlanos = async (req: Request, res: Response): Promise<void> => {
    try {
      const planos = await this.listarPlanosUseCase.execute();
      res.json(planos);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * POST /gestao/assinaturas
   * Criar uma assinatura
   */
  public criarAssinatura = async (req: Request, res: Response): Promise<void> => {
    try {
      const { codCliente, codPlano, custoFinal, descricao } = req.body;

      // Validações básicas
      if (!codCliente || !codPlano || !custoFinal || !descricao) {
        res.status(400).json({ 
          error: 'Dados obrigatórios não fornecidos',
          message: 'codCliente, codPlano, custoFinal e descricao são obrigatórios'
        });
        return;
      }

      const assinatura = await this.criarAssinaturaUseCase.execute({
        codCliente,
        codPlano,
        custoFinal,
        descricao
      });

      res.status(201).json(assinatura);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({ 
        error: statusCode === 404 ? 'Recurso não encontrado' : 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * PATCH /gestao/planos/:idPlano
   * Atualizar o custo mensal do plano
   */
  public atualizarCustoPlano = async (req: Request, res: Response): Promise<void> => {
    try {
      const idPlano = parseInt(req.params.idPlano);
      const { custoMensal } = req.body;

      if (isNaN(idPlano)) {
        res.status(400).json({ 
          error: 'Parâmetro inválido',
          message: 'ID do plano deve ser um número válido'
        });
        return;
      }

      if (!custoMensal || custoMensal <= 0) {
        res.status(400).json({ 
          error: 'Dados inválidos',
          message: 'custoMensal é obrigatório e deve ser maior que zero'
        });
        return;
      }

      const plano = await this.atualizarCustoPlanoUseCase.execute(idPlano, { custoMensal });
      res.json(plano);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({ 
        error: statusCode === 404 ? 'Plano não encontrado' : 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * GET /gestao/assinaturas/:tipo
   * Retorna a lista com todas as assinaturas de um determinado tipo
   */
  public listarAssinaturasPorTipo = async (req: Request, res: Response): Promise<void> => {
    try {
      const tipo = req.params.tipo.toUpperCase() as TipoAssinatura;

      if (!Object.values(TipoAssinatura).includes(tipo)) {
        res.status(400).json({ 
          error: 'Tipo inválido',
          message: 'Tipo deve ser TODOS, ATIVOS ou CANCELADOS'
        });
        return;
      }

      const assinaturas = await this.listarAssinaturasPorTipoUseCase.execute(tipo);
      res.json(assinaturas);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * GET /gestao/assinaturascliente/:codcli
   * Retorna a lista das assinaturas do cliente informado
   */
  public listarAssinaturasCliente = async (req: Request, res: Response): Promise<void> => {
    try {
      const codcli = parseInt(req.params.codcli);

      if (isNaN(codcli)) {
        res.status(400).json({ 
          error: 'Parâmetro inválido',
          message: 'Código do cliente deve ser um número válido'
        });
        return;
      }

      const assinaturas = await this.listarAssinaturasClienteUseCase.execute(codcli);
      res.json(assinaturas);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({ 
        error: statusCode === 404 ? 'Cliente não encontrado' : 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * GET /gestao/assinaturasplano/:codplano
   * Retorna a lista de assinaturas de um plano
   */
  public listarAssinaturasPlano = async (req: Request, res: Response): Promise<void> => {
    try {
      const codplano = parseInt(req.params.codplano);

      if (isNaN(codplano)) {
        res.status(400).json({ 
          error: 'Parâmetro inválido',
          message: 'Código do plano deve ser um número válido'
        });
        return;
      }

      const assinaturas = await this.listarAssinaturasPlanoUseCase.execute(codplano);
      res.json(assinaturas);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({ 
        error: statusCode === 404 ? 'Plano não encontrado' : 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
}