import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';

describe('API Route Contract Tests', () => {
  const app = createApp();

  test('GET /api/health responds with status structure', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('app', 'Sweety Blood Glucose Tracker API');
  });

  test('Protected endpoint GET /api/readings returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/readings');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  test('Protected endpoint GET /api/reports/daily returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/reports/daily');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  test('POST /api/auth/register validates required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bad-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  test('POST /api/auth/register validates weak password (< 8 chars or missing numbers)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'valid@example.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.message).toContain('at least 8 characters');
  });

  test('POST /api/auth/login validates empty credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  test('POST /api/auth/logout clears token cookie', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie'][0]).toContain('token=;');
  });
});
