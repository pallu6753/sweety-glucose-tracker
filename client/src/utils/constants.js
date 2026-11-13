export const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (fasting)' },
  { id: 'after_breakfast', label: 'After breakfast' },
  { id: 'after_lunch', label: 'After lunch' },
  { id: 'after_dinner', label: 'After dinner' },
];

export const TIME_SLOT_LABELS = {
  morning: 'Morning (fasting)',
  after_breakfast: 'After breakfast',
  after_lunch: 'After lunch',
  after_dinner: 'After dinner',
};

export const VALIDATION_MESSAGES = {
  REQUIRED_VALUE: 'Please enter a glucose value.',
  INVALID_RANGE: 'Value must be between 40 and 600 mg/dl.',
  DAILY_LIMIT: 'You can add only 4 readings per day.',
  FUTURE_DATE: 'Date cannot be in the future.',
  DUPLICATE_SLOT: (slotLabel) => `You already have an ${slotLabel} reading for this date.`,
};

export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
