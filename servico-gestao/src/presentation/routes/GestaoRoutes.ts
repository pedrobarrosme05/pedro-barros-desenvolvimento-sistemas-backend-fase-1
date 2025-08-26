import { Router } from 'express';
import { GestaoController } from '../controllers/GestaoController';

/**
 * Configuração das rotas do ServicoGestao
 * Implementa o padrão Router do Express
 */
export class GestaoRoutes {
  private router: Router;

  constructor(private gestaoController: GestaoController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GET /gestao/clientes - Listar todos os clientes cadastrados
    this.router.get('/clientes', this.gestaoController.listarClientes);

    // GET /gestao/planos - Listar todos os planos cadastrados
    this.router.get('/planos', this.gestaoController.listarPlanos);

    // POST /gestao/assinaturas - Criar uma assinatura
    this.router.post('/assinaturas', this.gestaoController.criarAssinatura);

    // PATCH /gestao/planos/:idPlano - Atualizar o custo mensal do plano
    this.router.patch('/planos/:idPlano', this.gestaoController.atualizarCustoPlano);

    // GET /gestao/assinaturas/:tipo - Retorna a lista com todas as assinaturas de um determinado tipo
    this.router.get('/assinaturas/:tipo', this.gestaoController.listarAssinaturasPorTipo);

    // GET /gestao/assinaturascliente/:codcli - Retorna a lista das assinaturas do cliente informado
    this.router.get('/assinaturascliente/:codcli', this.gestaoController.listarAssinaturasCliente);

    // GET /gestao/assinaturasplano/:codplano - Retorna a lista de assinaturas de um plano
    this.router.get('/assinaturasplano/:codplano', this.gestaoController.listarAssinaturasPlano);
  }

  public getRouter(): Router {
    return this.router;
  }
}