import {
  isValidDateString,
  isFutureDate,
  getMonthToDateRange,
  getPreviousMonthRange,
} from '../src/utils/dateUtils.js';

describe('Date Utilities & Calendar Boundary Tests', () => {
  test('validates valid date format YYYY-MM-DD', () => {
    expect(isValidDateString('2026-11-13')).toBe(true);
    expect(isValidDateString('2024-02-29')).toBe(true); // Leap year
    expect(isValidDateString('2026-02-29')).toBe(false); // Non-leap year
    expect(isValidDateString('invalid-date')).toBe(false);
    expect(isValidDateString('2026-13-01')).toBe(false);
    expect(isValidDateString('')).toBe(false);
  });

  test('checks future date correctly', () => {
    expect(isFutureDate('2099-12-31')).toBe(true);
    expect(isFutureDate('2020-01-01')).toBe(false);
  });

  test('calculates Month-to-Date range inclusive of selected date', () => {
    const range = getMonthToDateRange('2026-11-13');
    expect(range.start).toBe('2026-11-01');
    expect(range.end).toBe('2026-11-13');
  });

  test('calculates Previous Full Month range for standard month', () => {
    // Selected date: November 2026 -> Previous month: October 2026 (31 days)
    const range = getPreviousMonthRange('2026-11-13');
    expect(range.start).toBe('2026-10-01');
    expect(range.end).toBe('2026-10-31');
  });

  test('handles January year rollover to previous year December', () => {
    // Selected date: 15 January 2026 -> Previous month: 1 Dec 2025 - 31 Dec 2025
    const range = getPreviousMonthRange('2026-01-15');
    expect(range.start).toBe('2025-12-01');
    expect(range.end).toBe('2025-12-31');
  });

  test('handles leap year February in previous month calculation', () => {
    // Selected date: 10 March 2024 (2024 is a leap year) -> Previous month: Feb 2024 (29 days)
    const rangeLeap = getPreviousMonthRange('2024-03-10');
    expect(rangeLeap.start).toBe('2024-02-01');
    expect(rangeLeap.end).toBe('2024-02-29');

    // Selected date: 10 March 2026 (non-leap year) -> Previous month: Feb 2026 (28 days)
    const rangeNonLeap = getPreviousMonthRange('2026-03-10');
    expect(rangeNonLeap.start).toBe('2026-02-01');
    expect(rangeNonLeap.end).toBe('2026-02-28');
  });
});
