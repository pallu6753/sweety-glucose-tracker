import { validateReadingInput } from '../src/validators/readingValidator.js';
import { VALIDATION_MESSAGES } from '../src/utils/constants.js';

describe('Reading Validation Rules (Rules 1 - 5)', () => {
  const validReading = {
    reading_date: '2026-11-13',
    time_slot: 'morning',
    glucose_value: 120,
  };

  test('passes for valid reading input', () => {
    const validated = validateReadingInput(validReading);
    expect(validated.glucose_value).toBe(120);
    expect(validated.time_slot).toBe('morning');
  });

  // Rule 1: Value required
  test('Rule 1: rejects missing, null, or empty glucose value', () => {
    expect(() => validateReadingInput({ ...validReading, glucose_value: null }))
      .toThrow(VALIDATION_MESSAGES.REQUIRED_VALUE);

    expect(() => validateReadingInput({ ...validReading, glucose_value: undefined }))
      .toThrow(VALIDATION_MESSAGES.REQUIRED_VALUE);

    expect(() => validateReadingInput({ ...validReading, glucose_value: '' }))
      .toThrow(VALIDATION_MESSAGES.REQUIRED_VALUE);
  });

  // Rule 2: Whole number between 40 and 600
  test('Rule 2: rejects values outside [40, 600] and non-integers', () => {
    expect(() => validateReadingInput({ ...validReading, glucose_value: 39 }))
      .toThrow(VALIDATION_MESSAGES.INVALID_RANGE);

    expect(() => validateReadingInput({ ...validReading, glucose_value: 601 }))
      .toThrow(VALIDATION_MESSAGES.INVALID_RANGE);

    expect(() => validateReadingInput({ ...validReading, glucose_value: 120.5 }))
      .toThrow(VALIDATION_MESSAGES.INVALID_RANGE);

    expect(() => validateReadingInput({ ...validReading, glucose_value: 'abc' }))
      .toThrow(VALIDATION_MESSAGES.INVALID_RANGE);

    expect(() => validateReadingInput({ ...validReading, glucose_value: NaN }))
      .toThrow(VALIDATION_MESSAGES.INVALID_RANGE);
  });

  // Rule 2 boundary check
  test('Rule 2: accepts exact lower bound (40) and upper bound (600)', () => {
    expect(validateReadingInput({ ...validReading, glucose_value: 40 }).glucose_value).toBe(40);
    expect(validateReadingInput({ ...validReading, glucose_value: 600 }).glucose_value).toBe(600);
  });

  // Rule 5: Future dates
  test('Rule 5: rejects future dates', () => {
    expect(() => validateReadingInput({ ...validReading, reading_date: '2099-12-31' }))
      .toThrow(VALIDATION_MESSAGES.FUTURE_DATE);
  });

  test('rejects invalid time slots', () => {
    expect(() => validateReadingInput({ ...validReading, time_slot: 'midnight_snack' }))
      .toThrow('Invalid time slot selected.');
  });
});
