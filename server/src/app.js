import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { config } from './config/env.js';
import { testConnection } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import readingRoutes from './routes/readingRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  // 1. Security Headers
  app.use(helmet());

  // 2. CORS with Credentials & Render Domain Support
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        const allowedOrigins = [
          config.clientUrl,
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:4173',
        ].filter(Boolean);

        if (
          allowedOrigins.includes(origin) ||
          origin.endsWith('.onrender.com') ||
          origin.includes('localhost')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Body Parsing & Cookies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // 4. Rate Limiting for Auth
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: {
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      errors: [],
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // 5. Health Check
  app.get('/api/health', async (req, res) => {
    const dbStatus = await testConnection();
    res.status(dbStatus.connected ? 200 : 503).json({
      status: 'healthy',
      app: 'Sweety Blood Glucose Tracker API',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  });

  // 6. API Routes
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/readings', readingRoutes);
  app.use('/api/reports', reportRoutes);

  // 7. 404 Route Handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.originalUrl} not found.`,
      code: 'NOT_FOUND',
      errors: [],
    });
  });

  // 8. Centralized Error Handler
  app.use(errorHandler);

  return app;
};
