import { createApp } from './app.js';
import { config } from './config/env.js';
import { testConnection } from './config/db.js';

const startServer = async () => {
  const app = createApp();

  console.log('----------------------------------------------------');
  console.log('Sweety – Blood Glucose Tracker Backend API');
  console.log(`Environment: ${config.env}`);
  console.log(`Port:        ${config.port}`);
  console.log('----------------------------------------------------');

  // Verify DB connection
  const dbStatus = await testConnection();
  if (dbStatus.connected) {
    console.log(`[DATABASE] Connected to PostgreSQL (${dbStatus.database}) at ${dbStatus.time}`);
  } else {
    console.warn(`[DATABASE WARNING] Could not establish connection to PostgreSQL: ${dbStatus.error}`);
    console.warn('[DATABASE WARNING] Ensure PostgreSQL is running and credentials in .env are configured.');
  }

  const server = app.listen(config.port, () => {
    console.log(`[SERVER] Sweety API server running at http://localhost:${config.port}`);
  });

  return server;
};

startServer().catch((err) => {
  console.error('[FATAL ERROR] Failed to start server:', err);
  process.exit(1);
});
