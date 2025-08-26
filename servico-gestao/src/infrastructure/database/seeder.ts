import dotenv from 'dotenv';
import { Database } from './Database';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { PlanoRepository } from '../repositories/PlanoRepository';
import { AssinaturaRepository } from '../repositories/AssinaturaRepository';
import { Cliente } from '../../domain/entities/Cliente';
import { Plano } from '../../domain/entities/Plano';
import { Assinatura } from '../../domain/entities/Assinatura';

// Carregar variáveis de ambiente
dotenv.config();

/**
 * Script de seeding para popular o banco de dados com dados iniciais
 * Conforme especificação: pelo menos 10 clientes, 5 planos e 5 assinaturas
 */
class DatabaseSeeder {
  private db: Database;
  private clienteRepository: ClienteRepository;
  private planoRepository: PlanoRepository;
  private assinaturaRepository: AssinaturaRepository;

  constructor() {
    this.db = Database.getInstance();
    this.clienteRepository = new ClienteRepository();
    this.planoRepository = new PlanoRepository();
    this.assinaturaRepository = new AssinaturaRepository();
  }

  async run(): Promise<void> {
    try {
      console.log('🌱 Iniciando seeding do banco de dados...');

      // Inicializar tabelas
      await this.db.initTables();
      console.log('✅ Tabelas criadas/verificadas');

      // Verificar se já existem dados
      const clientesExistentes = await this.clienteRepository.findAll();
      if (clientesExistentes.length > 0) {
        console.log('⚠️  Dados já existem no banco. Pulando seeding.');
        return;
      }

      // Criar clientes
      await this.seedClientes();
      console.log('✅ Clientes criados');

      // Criar planos
      await this.seedPlanos();
      console.log('✅ Planos criados');

      // Criar assinaturas
      await this.seedAssinaturas();
      console.log('✅ Assinaturas criadas');

      console.log('🎉 Seeding concluído com sucesso!');

    } catch (error) {
      console.error('❌ Erro durante o seeding:', error);
      throw error;
    }
  }

  private async seedClientes(): Promise<void> {
    const clientes = [
      new Cliente(1, 'João Silva', 'joao.silva@email.com'),
      new Cliente(2, 'Maria Santos', 'maria.santos@email.com'),
      new Cliente(3, 'Pedro Oliveira', 'pedro.oliveira@email.com'),
      new Cliente(4, 'Ana Costa', 'ana.costa@email.com'),
      new Cliente(5, 'Carlos Ferreira', 'carlos.ferreira@email.com'),
      new Cliente(6, 'Lucia Almeida', 'lucia.almeida@email.com'),
      new Cliente(7, 'Roberto Lima', 'roberto.lima@email.com'),
      new Cliente(8, 'Fernanda Rocha', 'fernanda.rocha@email.com'),
      new Cliente(9, 'Ricardo Barbosa', 'ricardo.barbosa@email.com'),
      new Cliente(10, 'Patricia Mendes', 'patricia.mendes@email.com'),
      new Cliente(11, 'Bruno Cardoso', 'bruno.cardoso@email.com'),
      new Cliente(12, 'Juliana Pereira', 'juliana.pereira@email.com')
    ];

    for (const cliente of clientes) {
      await this.clienteRepository.save(cliente);
    }
  }

  private async seedPlanos(): Promise<void> {
    const hoje = new Date();
    
    const planos = [
      new Plano(
        1, 
        'Plano Básico Fibra', 
        49.90, 
        hoje, 
        'Internet fibra óptica 100MB, sem franquia de dados, ideal para uso residencial básico'
      ),
      new Plano(
        2, 
        'Plano Família Plus', 
        89.90, 
        hoje, 
        'Internet fibra 300MB + TV por assinatura com 80 canais + telefone fixo ilimitado'
      ),
      new Plano(
        3, 
        'Plano Gamer Pro', 
        129.90, 
        hoje, 
        'Internet fibra 600MB com baixa latência, ideal para jogos online e streaming'
      ),
      new Plano(
        4, 
        'Plano Empresarial', 
        199.90, 
        hoje, 
        'Internet fibra simétrica 1GB + IP fixo + suporte técnico 24h para empresas'
      ),
      new Plano(
        5, 
        'Plano Ultra Premium', 
        299.90, 
        hoje, 
        'Internet fibra 1GB + TV 4K com canais premium + telefone + serviços de streaming inclusos'
      )
    ];

    for (const plano of planos) {
      await this.planoRepository.save(plano);
    }
  }

  private async seedAssinaturas(): Promise<void> {
    // Criar assinaturas com diferentes cenários de teste
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    
    const mesPassado = new Date();
    mesPassado.setMonth(mesPassado.getMonth() - 1);

    const proximoAno = new Date();
    proximoAno.setFullYear(proximoAno.getFullYear() + 1);

    const assinaturas = [
      // Assinatura ativa - cliente 1, plano 1
      new Assinatura(
        1, 1, 1, hoje, proximoAno, hoje, 39.90,
        'Desconto de fidelidade de 20% aplicado por 12 meses'
      ),
      // Assinatura ativa - cliente 2, plano 2
      new Assinatura(
        2, 2, 2, hoje, proximoAno, hoje, 79.90,
        'Desconto de fidelidade de 10% + promoção família'
      ),
      // Assinatura ativa - cliente 3, plano 3
      new Assinatura(
        3, 3, 3, hoje, proximoAno, ontem, 119.90,
        'Desconto gamer de 8% por fidelidade de 12 meses'
      ),
      // Assinatura inativa (pagamento em atraso) - cliente 4, plano 1
      new Assinatura(
        4, 1, 4, hoje, proximoAno, mesPassado, 44.90,
        'Desconto de 10% por fidelidade aplicado'
      ),
      // Assinatura ativa - cliente 5, plano 4
      new Assinatura(
        5, 4, 5, hoje, proximoAno, hoje, 179.90,
        'Desconto empresarial de 10% por contrato anual'
      ),
      // Assinatura ativa - cliente 6, plano 5
      new Assinatura(
        6, 5, 6, hoje, proximoAno, hoje, 269.90,
        'Desconto VIP de 10% + bônus streaming grátis'
      )
    ];

    for (const assinatura of assinaturas) {
      await this.assinaturaRepository.save(assinatura);
    }
  }
}

// Executar seeding se este arquivo for executado diretamente
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.run()
    .then(() => {
      console.log('✅ Seeding concluído');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no seeding:', error);
      process.exit(1);
    });
}

export default DatabaseSeeder;