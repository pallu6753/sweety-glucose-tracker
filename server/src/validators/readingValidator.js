import { TIME_SLOTS, TIME_SLOT_LABELS, VALIDATION_MESSAGES, ERROR_CODES } from '../utils/constants.js';
import { isValidDateString, isFutureDate } from '../utils/dateUtils.js';
import { ApiError } from '../utils/errors.js';

export const validateReadingInput = ({ reading_date, time_slot, glucose_value }) => {
  // 1. Validate glucose value presence
  if (glucose_value === undefined || glucose_value === null || glucose_value === '') {
    throw new ApiError(400, VALIDATION_MESSAGES.REQUIRED_VALUE, ERROR_CODES.VALIDATION_ERROR);
  }

  // 2. Validate whole number between 40 and 600
  // Reject decimals, non-numeric strings, NaN, infinity
  const isInteger = Number.isInteger(glucose_value) || (
    typeof glucose_value === 'string' &&
    /^-?\d+$/.test(glucose_value.trim())
  );

  const numericValue = Number(glucose_value);

  if (!isInteger || isNaN(numericValue) || numericValue < 40 || numericValue > 600) {
    throw new ApiError(400, VALIDATION_MESSAGES.INVALID_RANGE, ERROR_CODES.VALIDATION_ERROR);
  }

  // 3. Validate reading date
  if (!reading_date || !isValidDateString(reading_date)) {
    throw new ApiError(400, 'Please provide a valid date in YYYY-MM-DD format.', ERROR_CODES.VALIDATION_ERROR);
  }

  // 4. Validate no future date
  if (isFutureDate(reading_date)) {
    throw new ApiError(400, VALIDATION_MESSAGES.FUTURE_DATE, ERROR_CODES.FUTURE_DATE);
  }

  // 5. Validate time slot
  if (!time_slot || !TIME_SLOTS.includes(time_slot)) {
    throw new ApiError(400, 'Invalid time slot selected.', ERROR_CODES.VALIDATION_ERROR);
  }

  return {
    reading_date,
    time_slot,
    glucose_value: numericValue,
  };
};
