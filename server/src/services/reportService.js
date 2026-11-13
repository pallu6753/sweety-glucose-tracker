import { query } from '../config/db.js';
import { TIME_SLOT_LABELS, TIME_SLOT_ORDER } from '../utils/constants.js';
import { isValidDateString, getMonthToDateRange, getPreviousMonthRange } from '../utils/dateUtils.js';
import { ApiError } from '../utils/errors.js';

const formatDate = (val) => {
  if (val instanceof Date) {
    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(val).split('T')[0];
};

/**
 * Helper to fetch aggregated stats for a date range
 */
const fetchAggregatedStats = async (userId, startDate, endDate) => {
  const statsRes = await query(
    `SELECT 
       MAX(glucose_value)::int as highest,
       MIN(glucose_value)::int as lowest,
       ROUND(AVG(glucose_value)::numeric, 1)::float as average,
       COUNT(*)::int as count
     FROM readings
     WHERE user_id = $1 AND reading_date >= $2 AND reading_date <= $3`,
    [userId, startDate, endDate]
  );

  const row = statsRes.rows[0];
  const count = row.count || 0;

  return {
    highest: count > 0 ? row.highest : null,
    lowest: count > 0 ? row.lowest : null,
    average: count > 0 ? row.average : null,
    count,
  };
};

/**
 * 1. Daily Report
 */
export const getDailyReport = async (userId, dateStr) => {
  if (!isValidDateString(dateStr)) {
    throw new ApiError(400, 'Invalid date format. Expected YYYY-MM-DD.', 'VALIDATION_ERROR');
  }

  // 1. Fetch statistics
  const statistics = await fetchAggregatedStats(userId, dateStr, dateStr);

  // 2. Fetch individual readings for the date
  const readingsRes = await query(
    `SELECT id, reading_date, time_slot, glucose_value, created_at
     FROM readings
     WHERE user_id = $1 AND reading_date = $2`,
    [userId, dateStr]
  );

  // Sort logically by standard slot order: morning, after_breakfast, after_lunch, after_dinner
  const readings = readingsRes.rows
    .map((r) => ({
      id: r.id,
      reading_date: formatDate(r.reading_date),
      time_slot: r.time_slot,
      time_slot_label: TIME_SLOT_LABELS[r.time_slot] || r.time_slot,
      glucose_value: r.glucose_value,
      created_at: r.created_at,
      order: TIME_SLOT_ORDER[r.time_slot] || 99,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...rest }) => rest);

  return {
    type: 'daily',
    period: {
      start: dateStr,
      end: dateStr,
    },
    statistics,
    readings,
    has_data: statistics.count > 0,
  };
};

/**
 * 2. Month-to-Date Report
 */
export const getMonthToDateReport = async (userId, dateStr) => {
  if (!isValidDateString(dateStr)) {
    throw new ApiError(400, 'Invalid date format. Expected YYYY-MM-DD.', 'VALIDATION_ERROR');
  }

  const { start, end } = getMonthToDateRange(dateStr);
  const statistics = await fetchAggregatedStats(userId, start, end);

  return {
    type: 'month-to-date',
    period: {
      start,
      end,
    },
    statistics,
    has_data: statistics.count > 0,
  };
};

/**
 * 3. Monthly Report (Previous Calendar Month)
 */
export const getMonthlyReport = async (userId, dateStr) => {
  if (!isValidDateString(dateStr)) {
    throw new ApiError(400, 'Invalid date format. Expected YYYY-MM-DD.', 'VALIDATION_ERROR');
  }

  const { start, end } = getPreviousMonthRange(dateStr);
  const statistics = await fetchAggregatedStats(userId, start, end);

  return {
    type: 'monthly',
    period: {
      start,
      end,
    },
    statistics,
    has_data: statistics.count > 0,
  };
};
