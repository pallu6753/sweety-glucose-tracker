import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ReadingFormModal } from '../components/readings/ReadingFormModal';
import { VALIDATION_MESSAGES } from '../utils/constants';

describe('Frontend Reading Form Validation Tests', () => {
  it('validates Rule 1: Value required', async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <ReadingFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={null}
        existingReadings={[]}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /save reading/i });
    fireEvent.click(submitBtn);

    // Form validation prevents submission when glucose value is empty
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('validates Rule 2: Whole number between 40 and 600', async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <ReadingFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={null}
        existingReadings={[]}
      />
    );

    const input = screen.getByPlaceholderText(/e\.g\. 110/i);
    const submitBtn = screen.getByRole('button', { name: /save reading/i });

    // Test below 40
    await userEvent.clear(input);
    await userEvent.type(input, '35');
    fireEvent.click(submitBtn);

    expect(screen.getByText(VALIDATION_MESSAGES.INVALID_RANGE)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Test above 600
    await userEvent.clear(input);
    await userEvent.type(input, '650');
    fireEvent.click(submitBtn);

    expect(screen.getByText(VALIDATION_MESSAGES.INVALID_RANGE)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('validates Rule 3: Duplicate slot error', async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();
    const today = new Date().toISOString().split('T')[0];
    const existing = [
      { id: '1', reading_date: today, time_slot: 'morning', glucose_value: 100 },
    ];

    render(
      <ReadingFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={null}
        existingReadings={existing}
      />
    );

    const input = screen.getByPlaceholderText(/e\.g\. 110/i);
    const submitBtn = screen.getByRole('button', { name: /save reading/i });

    await userEvent.type(input, '120');
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(VALIDATION_MESSAGES.DUPLICATE_SLOT('Morning (fasting)'))
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
