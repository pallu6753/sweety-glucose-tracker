import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.NODE_ENV === 'test'
  ? config.testDatabaseUrl
  : config.databaseUrl;

const pool = new Pool({ connectionString });

export const runMigrations = async () => {
  const client = await pool.connect();
  try {
    console.log('[MIGRATION] Connecting to PostgreSQL database...');
    
    // Create migrations table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql') && !f.includes('_down'))
      .sort();

    for (const file of files) {
      const alreadyApplied = await client.query(
        'SELECT id FROM schema_migrations WHERE migration_name = $1',
        [file]
      );

      if (alreadyApplied.rows.length === 0) {
        console.log(`[MIGRATION] Applying migration: ${file}...`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`[MIGRATION] Successfully applied: ${file}`);
      } else {
        console.log(`[MIGRATION] Migration already applied: ${file}`);
      }
    }
    console.log('[MIGRATION] All database migrations are up to date.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[MIGRATION ERROR] Failed to run migrations:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Execute if run directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
