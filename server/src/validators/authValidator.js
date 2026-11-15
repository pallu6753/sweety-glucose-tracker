import { ApiError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationInput = ({ name, email, password }) => {
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new ApiError(400, 'Please enter your full name (at least 2 characters).', ERROR_CODES.VALIDATION_ERROR);
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    throw new ApiError(400, 'Please enter a valid email address.', ERROR_CODES.VALIDATION_ERROR);
  }

  const PASSWORD_STRENGTH_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!password || typeof password !== 'string' || !PASSWORD_STRENGTH_REGEX.test(password)) {
    throw new ApiError(400, 'Password must be at least 8 characters long and contain at least one letter and one number.', ERROR_CODES.VALIDATION_ERROR);
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };
};

export const validateLoginInput = ({ email, password }) => {
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    throw new ApiError(400, 'Please enter a valid email address.', ERROR_CODES.VALIDATION_ERROR);
  }

  if (!password || typeof password !== 'string') {
    throw new ApiError(400, 'Please enter your password.', ERROR_CODES.VALIDATION_ERROR);
  }

  return {
    email: email.trim().toLowerCase(),
    password,
  };
};
