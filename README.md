# Sistema de Controle de Planos de Operadora - Fase 1

## Descrição do Projeto

Este repositório contém a implementação da **Fase 1** do projeto de Desenvolvimento de Sistemas Backend, que consiste em um sistema para gerenciar planos de clientes de operadoras de internet.

## Arquitetura

O projeto foi desenvolvido seguindo os princípios da **Arquitetura Limpa** (Clean Architecture) proposta por Robert Martin, aplicando os princípios SOLID e padrões de design adequados.

## Estrutura do Repositório

```
├── servico-gestao/                          # Código fonte do ServicoGestao
│   ├── src/                                 # Código TypeScript
│   │   ├── domain/                         # Camada de Domínio
│   │   ├── application/                    # Camada de Aplicação  
│   │   ├── infrastructure/                 # Camada de Infraestrutura
│   │   └── presentation/                   # Camada de Apresentação
│   ├── package.json                        # Dependências e scripts
│   ├── tsconfig.json                       # Configuração TypeScript
│   └── README.md                           # Documentação técnica
└── pedro_barros_Desenvolvimento_de_Sistemas_backend_Fase-1.postman_collection.json
```

## Tecnologias Utilizadas

- **TypeScript** - Linguagem principal
- **Node.js** - Runtime
- **Express.js** - Framework web
- **SQLite** - Banco de dados
- **Clean Architecture** - Padrão arquitetural

## Como Executar

1. Navegue até a pasta do serviço:
```bash
cd servico-gestao
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o projeto:
```bash
npm run build
```

4. Execute o seeding (dados iniciais):
```bash
npm run seed
```

5. Inicie o servidor:
```bash
npm start
```

O servidor estará disponível em: http://localhost:3000

## Endpoints Disponíveis

- `GET /gestao/clientes` - Lista clientes
- `GET /gestao/planos` - Lista planos
- `POST /gestao/assinaturas` - Cria assinatura
- `PATCH /gestao/planos/:id` - Atualiza custo do plano
- `GET /gestao/assinaturas/:tipo` - Lista assinaturas por tipo
- `GET /gestao/assinaturascliente/:id` - Lista assinaturas do cliente
- `GET /gestao/assinaturasplano/:id` - Lista assinaturas do plano

## Testes

Importe a coleção do Postman incluída no repositório para testar todos os endpoints.

## Autor

Pedro Barros - Desenvolvimento de Sistemas Backend