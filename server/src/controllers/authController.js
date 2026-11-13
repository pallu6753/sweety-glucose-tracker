import * as authService from '../services/authService.js';
import { validateRegistrationInput, validateLoginInput } from '../validators/authValidator.js';

// Cookie options for secure HttpOnly session storage
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export const register = async (req, res, next) => {
  try {
    const validatedData = validateRegistrationInput(req.body);
    const { user, token } = await authService.register(validatedData);

    res.cookie('token', token, getCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = validateLoginInput(req.body);
    const { user, token } = await authService.login(validatedData);

    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
