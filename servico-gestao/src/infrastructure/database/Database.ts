import sqlite3 from 'sqlite3';
import { promisify } from 'util';

/**
 * Classe para gerenciar a conexão com o banco de dados SQLite
 * Implementa o padrão Singleton para garantir uma única instância
 */
export class Database {
  private static instance: Database;
  private db: sqlite3.Database;

  private constructor() {
    const dbPath = process.env.DB_PATH || './database.sqlite';
    this.db = new sqlite3.Database(dbPath);
    
    // Habilitar foreign keys
    this.db.run('PRAGMA foreign_keys = ON');
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getConnection(): sqlite3.Database {
    return this.db;
  }

  /**
   * Executa uma query que não retorna dados (INSERT, UPDATE, DELETE)
   */
  public async run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  /**
   * Executa uma query que retorna uma única linha
   */
  public async get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Executa uma query que retorna múltiplas linhas
   */
  public async all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Inicializa as tabelas do banco de dados
   */
  public async initTables(): Promise<void> {
    const createClientesTable = `
      CREATE TABLE IF NOT EXISTS clientes (
        codigo INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `;

    const createPlanosTable = `
      CREATE TABLE IF NOT EXISTS planos (
        codigo INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        custoMensal REAL NOT NULL,
        data TEXT NOT NULL,
        descricao TEXT NOT NULL
      )
    `;

    const createAssinaturasTable = `
      CREATE TABLE IF NOT EXISTS assinaturas (
        codigo INTEGER PRIMARY KEY,
        codPlano INTEGER NOT NULL,
        codCli INTEGER NOT NULL,
        inicioFidelidade TEXT NOT NULL,
        fimFidelidade TEXT NOT NULL,
        dataUltimoPagamento TEXT NOT NULL,
        custoFinal REAL NOT NULL,
        descricao TEXT NOT NULL,
        FOREIGN KEY (codPlano) REFERENCES planos(codigo),
        FOREIGN KEY (codCli) REFERENCES clientes(codigo)
      )
    `;

    const createPagamentosTable = `
      CREATE TABLE IF NOT EXISTS pagamentos (
        codigo INTEGER PRIMARY KEY,
        codAss INTEGER NOT NULL,
        valorPago REAL NOT NULL,
        dataPagamento TEXT NOT NULL,
        FOREIGN KEY (codAss) REFERENCES assinaturas(codigo)
      )
    `;

    await this.run(createClientesTable);
    await this.run(createPlanosTable);
    await this.run(createAssinaturasTable);
    await this.run(createPagamentosTable);
  }

  /**
   * Fecha a conexão com o banco de dados
   */
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}