import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server root or project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const requiredEnvVars = ['JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    // Provide safe defaults for development if not explicitly set
    if (envVar === 'JWT_SECRET' && process.env.NODE_ENV !== 'production') {
      process.env.JWT_SECRET = 'sweety_dev_secret_key_change_in_production_minimum_32_chars';
      console.warn(`[WARN] ${envVar} not found. Using development fallback.`);
    } else {
      throw new Error(`[CRITICAL] Missing required environment variable: ${envVar}`);
    }
  }
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sweety_glucose_tracker',
  testDatabaseUrl: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sweety_glucose_tracker_test',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
