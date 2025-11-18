"use strict";

const { Pool } = require("pg");
const { PG_DEFAULT_POOL } = require("../lib/constants");

class PGPoolFactory {
  /**
   * Cria um novo pool de conexões PostgreSQL
   * @param {object} config Configuração adicional
   */
  static createPool(config = {}) {
    const pool = new Pool({
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      query_timeout: 30000,
      ssl: false,
      max: parseInt(process.env.DB_POOL_MAX || "10", 10),
      ...config,
    });

    pool.on("error", (err) => {
      console.error("❌ [PostgreSQL] Erro inesperado no pool:", err);
    });

    if (process.env.NODE_ENV !== "production") {
      pool.on("connect", () => {
        console.log("✅ [PostgreSQL] Nova conexão estabelecida.");
      });

      pool.on("remove", () => {
        console.log("🔌 [PostgreSQL] Conexão encerrada.");
      });
    }

    return pool;
  }
}

class Database {
  /**
   * @param {Pool} pool
   */
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Executa uma query no banco de dados
   * @param {string} text SQL
   * @param {Array} params parâmetros
   */
  async query(text, params = []) {
    const client = await this.pool.connect();
    const startTime = Date.now();
    try {
      const result = await client.query(text, params);
      const duration = Date.now() - startTime;

      if (process.env.NODE_ENV !== "production") {
        console.log(`📝 [PostgreSQL] Query executada em ${duration}ms:`, text);
      }

      return result;
    } catch (err) {
      console.error("❌ [PostgreSQL] Erro na query:", { text, params, err });
      throw err;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.pool.end();
    console.log("🔒 [PostgreSQL] Pool encerrado.");
  }
}

const defaultPool = PGPoolFactory.createPool(PG_DEFAULT_POOL);
const database = new Database(defaultPool);

module.exports = {
  database,
  Database,
  PGPoolFactory,
};
