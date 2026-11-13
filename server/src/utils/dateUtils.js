/**
 * Strict date utilities to prevent timezone-related shifts
 */

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const isValidDateString = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string' || !DATE_REGEX.test(dateStr)) {
    return false;
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
};

export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isFutureDate = (dateStr) => {
  const todayStr = getTodayDateString();
  return dateStr > todayStr;
};

/**
 * Month-to-date period: First day of selected month through selected date inclusive
 */
export const getMonthToDateRange = (dateStr) => {
  const [year, month] = dateStr.split('-');
  const start = `${year}-${month}-01`;
  return {
    start,
    end: dateStr,
  };
};

/**
 * Previous full calendar month range
 * Correctly handles January -> previous year December transition and leap years
 */
export const getPreviousMonthRange = (dateStr) => {
  const [yearNum, monthNum] = dateStr.split('-').map(Number);
  
  let prevYear = yearNum;
  let prevMonth = monthNum - 1;

  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }

  // Days in previous month
  const isLeapYear = (prevYear % 4 === 0 && prevYear % 100 !== 0) || (prevYear % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const lastDay = daysInMonth[prevMonth - 1];

  const monthFormatted = String(prevMonth).padStart(2, '0');
  const start = `${prevYear}-${monthFormatted}-01`;
  const end = `${prevYear}-${monthFormatted}-${String(lastDay).padStart(2, '0')}`;

  return { start, end };
};
