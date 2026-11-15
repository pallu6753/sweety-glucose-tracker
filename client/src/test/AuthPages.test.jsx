import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';

// Mock AuthContext
const mockLogin = vi.fn().mockResolvedValue({ success: true });
const mockRegister = vi.fn().mockResolvedValue({ success: true });

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
  }),
}));

describe('Authentication Pages Validation & Accessibility Tests', () => {
  it('validates password matching on RegisterPage', async () => {
    render(<RegisterPage onNavigateToLogin={() => {}} onNavigateToHome={() => {}} />);

    await userEvent.type(screen.getByPlaceholderText(/e\.g\. Jane Doe/i), 'Jane Doe');
    await userEvent.type(screen.getByPlaceholderText(/e\.g\. jane@example\.com/i), 'jane@example.com');
    await userEvent.type(screen.getByPlaceholderText(/At least 8 chars with letter & number/i), 'ValidPass123');
    await userEvent.type(screen.getByPlaceholderText(/Re-enter your password/i), 'DifferentPass456');

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText(/Passwords do not match\. Please verify both entries\./i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates weak password without numbers on RegisterPage', async () => {
    render(<RegisterPage onNavigateToLogin={() => {}} onNavigateToHome={() => {}} />);

    await userEvent.type(screen.getByPlaceholderText(/e\.g\. Jane Doe/i), 'Jane Doe');
    await userEvent.type(screen.getByPlaceholderText(/e\.g\. jane@example\.com/i), 'jane@example.com');
    await userEvent.type(screen.getByPlaceholderText(/At least 8 chars with letter & number/i), 'letters-only');
    await userEvent.type(screen.getByPlaceholderText(/Re-enter your password/i), 'letters-only');

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText(/Password must be at least 8 characters long and contain at least one letter and one number\./i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('triggers 1-click Demo Account login on LoginPage', async () => {
    render(<LoginPage onNavigateToRegister={() => {}} onNavigateToHome={() => {}} />);

    const demoBtn = screen.getByRole('button', { name: /⚡ Try Demo Account/i });
    expect(demoBtn).toBeInTheDocument();

    fireEvent.click(demoBtn);
    expect(mockLogin).toHaveBeenCalledWith('demo@sweety.com', 'SweetyDemo2026!');
  });

  it('displays error message when Demo Account login fails', async () => {
    mockLogin.mockResolvedValueOnce({ success: false, message: 'Invalid email or password.' });
    render(<LoginPage onNavigateToRegister={() => {}} onNavigateToHome={() => {}} />);

    const demoBtn = screen.getByRole('button', { name: /⚡ Try Demo Account/i });
    fireEvent.click(demoBtn);

    const errorAlert = await screen.findByText('Invalid email or password.');
    expect(errorAlert).toBeInTheDocument();
  });
});
