import App from './App';

/**
 * Ponto de entrada da aplicação ServicoGestao
 */
async function main() {
  try {
    const app = new App();
    
    // Inicializar banco de dados e tabelas
    await app.initialize();
    
    // Iniciar servidor
    app.start();
    
  } catch (error) {
    console.error('❌ Falha ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

// Executar aplicação
main();