import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authenticate } from '../src/middleware/auth.js';
import { config } from '../src/config/env.js';

describe('Authentication Middleware Tests', () => {
  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  });

  test('rejects request without token (401)', () => {
    const req = { cookies: {}, headers: {} };
    const res = mockResponse();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  test('rejects request with invalid token signature (401)', () => {
    const req = {
      cookies: {},
      headers: { authorization: 'Bearer invalid.token.payload' },
    };
    const res = mockResponse();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
  });

  test('rejects expired token (401)', () => {
    // Generate expired token
    const expiredToken = jwt.sign(
      { id: 'user-123', email: 'test@example.com' },
      config.jwtSecret,
      { expiresIn: '-1s' }
    );

    const req = {
      cookies: { token: expiredToken },
      headers: {},
    };
    const res = mockResponse();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toContain('expired');
  });

  test('authenticates valid token from HttpOnly cookie and populates req.user', () => {
    const validToken = jwt.sign(
      { id: 'user-uuid-123', email: 'user@sweety.com', name: 'Sweety User' },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    const req = {
      cookies: { token: validToken },
      headers: {},
    };
    const res = mockResponse();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // called with no error
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('user-uuid-123');
    expect(req.user.email).toBe('user@sweety.com');
  });
});
