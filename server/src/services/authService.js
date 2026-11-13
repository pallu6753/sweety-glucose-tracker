import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { config } from '../config/env.js';
import { ApiError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

export const register = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new ApiError(409, 'An account with this email address already exists.', ERROR_CODES.CONFLICT);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  const result = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash]
  );

  const user = result.rows[0];

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return { user, token };
};

export const login = async ({ email, password }) => {
  // Find user by normalized email
  const result = await query(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new ApiError(401, 'Invalid email or password.', ERROR_CODES.INVALID_CREDENTIALS);
  }

  const user = result.rows[0];

  // Compare password hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.', ERROR_CODES.INVALID_CREDENTIALS);
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const result = await query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found.', ERROR_CODES.NOT_FOUND);
  }

  return result.rows[0];
};
