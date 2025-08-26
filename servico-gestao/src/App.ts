import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Database } from './infrastructure/database/Database';
import { ClienteRepository } from './infrastructure/repositories/ClienteRepository';
import { PlanoRepository } from './infrastructure/repositories/PlanoRepository';
import { AssinaturaRepository } from './infrastructure/repositories/AssinaturaRepository';
import { ListarClientesUseCase } from './application/use-cases/ListarClientesUseCase';
import { ListarPlanosUseCase } from './application/use-cases/ListarPlanosUseCase';
import { CriarAssinaturaUseCase } from './application/use-cases/CriarAssinaturaUseCase';
import { AtualizarCustoPlanoUseCase } from './application/use-cases/AtualizarCustoPlanoUseCase';
import { ListarAssinaturasPorTipoUseCase } from './application/use-cases/ListarAssinaturasPorTipoUseCase';
import { ListarAssinaturasClienteUseCase } from './application/use-cases/ListarAssinaturasClienteUseCase';
import { ListarAssinaturasPlanoUseCase } from './application/use-cases/ListarAssinaturasPlanoUseCase';
import { GestaoController } from './presentation/controllers/GestaoController';
import { GestaoRoutes } from './presentation/routes/GestaoRoutes';

// Carregar variáveis de ambiente
dotenv.config();

/**
 * Classe principal da aplicação
 * Implementa o padrão de Composição Root para injeção de dependências
 * Segue os princípios SOLID, especialmente Dependency Inversion
 */
class App {
  private app: Application;
  private database: Database;

  constructor() {
    this.app = express();
    this.database = Database.getInstance();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    // Middleware de segurança
    this.app.use(helmet());
    
    // Middleware de CORS
    this.app.use(cors());
    
    // Middleware para parsing de JSON
    this.app.use(express.json());
    
    // Middleware para parsing de URL encoded
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Dependency Injection - Composition Root
    const clienteRepository = new ClienteRepository();
    const planoRepository = new PlanoRepository();
    const assinaturaRepository = new AssinaturaRepository();

    // Use Cases
    const listarClientesUseCase = new ListarClientesUseCase(clienteRepository);
    const listarPlanosUseCase = new ListarPlanosUseCase(planoRepository);
    const criarAssinaturaUseCase = new CriarAssinaturaUseCase(
      assinaturaRepository,
      clienteRepository,
      planoRepository
    );
    const atualizarCustoPlanoUseCase = new AtualizarCustoPlanoUseCase(planoRepository);
    const listarAssinaturasPorTipoUseCase = new ListarAssinaturasPorTipoUseCase(assinaturaRepository);
    const listarAssinaturasClienteUseCase = new ListarAssinaturasClienteUseCase(
      assinaturaRepository,
      clienteRepository
    );
    const listarAssinaturasPlanoUseCase = new ListarAssinaturasPlanoUseCase(
      assinaturaRepository,
      planoRepository
    );

    // Controller
    const gestaoController = new GestaoController(
      listarClientesUseCase,
      listarPlanosUseCase,
      criarAssinaturaUseCase,
      atualizarCustoPlanoUseCase,
      listarAssinaturasPorTipoUseCase,
      listarAssinaturasClienteUseCase,
      listarAssinaturasPlanoUseCase
    );

    // Routes
    const gestaoRoutes = new GestaoRoutes(gestaoController);
    this.app.use('/gestao', gestaoRoutes.getRouter());

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', service: 'ServicoGestao', timestamp: new Date().toISOString() });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ 
        error: 'Endpoint não encontrado',
        message: `Rota ${req.method} ${req.originalUrl} não existe`
      });
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Inicializar banco de dados
      await this.database.initTables();
      console.log('✅ Banco de dados inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }

  public start(): void {
    const port = process.env.PORT || 3000;
    
    this.app.listen(port, () => {
      console.log(`🚀 ServicoGestao rodando na porta ${port}`);
      console.log(`📚 Documentação: http://localhost:${port}/health`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;