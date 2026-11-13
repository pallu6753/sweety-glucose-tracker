import { ApiError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected internal server error occurred.';
  let code = err.code || ERROR_CODES.SERVER_ERROR;
  let errors = err.errors || [];

  // Handle PostgreSQL specific errors
  if (err.code === '23505') {
    // Unique constraint violation
    statusCode = 409;
    code = ERROR_CODES.DUPLICATE_READING;
    if (err.constraint === 'uq_user_date_slot') {
      message = 'A reading already exists for this slot on this date.';
    } else if (err.constraint === 'users_email_key') {
      message = 'An account with this email address already exists.';
      code = ERROR_CODES.CONFLICT;
    }
  } else if (err.code === '23514') {
    // Check constraint violation
    statusCode = 400;
    code = ERROR_CODES.VALIDATION_ERROR;
    message = 'Data provided violates database integrity checks.';
  } else if (err.code === '22P02') {
    // Invalid UUID or input syntax
    statusCode = 400;
    code = ERROR_CODES.VALIDATION_ERROR;
    message = 'Invalid input format provided.';
  }

  // Hide internal server error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'An internal server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    errors,
  });
};
