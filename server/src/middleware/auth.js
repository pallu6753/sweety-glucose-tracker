import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

export const authenticate = (req, res, next) => {
  try {
    // 1. Extract token from HttpOnly cookie or Authorization Bearer header
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Authentication required. Please log in.', ERROR_CODES.UNAUTHORIZED);
    }

    // 2. Verify JWT signature & expiration
    const decoded = jwt.verify(token, config.jwtSecret);

    // 3. Attach authenticated user details to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Your session has expired. Please log in again.', ERROR_CODES.UNAUTHORIZED));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid authentication token.', ERROR_CODES.UNAUTHORIZED));
    }
    next(error);
  }
};
