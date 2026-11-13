export const TIME_SLOTS = [
  'morning',
  'after_breakfast',
  'after_lunch',
  'after_dinner',
];

export const TIME_SLOT_LABELS = {
  morning: 'Morning (fasting)',
  after_breakfast: 'After breakfast',
  after_lunch: 'After lunch',
  after_dinner: 'After dinner',
};

export const TIME_SLOT_ORDER = {
  morning: 1,
  after_breakfast: 2,
  after_lunch: 3,
  after_dinner: 4,
};

export const VALIDATION_MESSAGES = {
  REQUIRED_VALUE: 'Please enter a glucose value.',
  INVALID_RANGE: 'Value must be between 40 and 600 mg/dl.',
  DAILY_LIMIT: 'You can add only 4 readings per day.',
  FUTURE_DATE: 'Date cannot be in the future.',
  DUPLICATE_SLOT: (slotLabel) => `You already have an ${slotLabel} reading for this date.`,
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_READING: 'DUPLICATE_READING',
  DAILY_LIMIT_REACHED: 'DAILY_LIMIT_REACHED',
  FUTURE_DATE: 'FUTURE_DATE',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
};
