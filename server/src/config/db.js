import pkg from 'pg';
const { Pool } = pkg;
import { config } from './env.js';

// Select database URL based on environment
const connectionString = process.env.NODE_ENV === 'test'
  ? config.testDatabaseUrl
  : config.databaseUrl;

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DATABASE] Unexpected error on idle client', err);
});

/**
 * Execute parameterized query
 * @param {string} text - SQL query with $1, $2 placeholders
 * @param {Array} params - Array of parameter values
 */
export const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    // console.log(`[QUERY] executed: ${text} in ${duration}ms`);
  }
  return res;
};

/**
 * Get dedicated client from pool for transactions
 */
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

/**
 * Health check helper to verify PostgreSQL connectivity
 */
export const testConnection = async () => {
  try {
    const res = await query('SELECT NOW() as current_time, current_database() as db_name');
    return {
      connected: true,
      time: res.rows[0].current_time,
      database: res.rows[0].db_name,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
};
