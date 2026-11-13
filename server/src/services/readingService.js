import { getClient, query } from '../config/db.js';
import { TIME_SLOT_LABELS, VALIDATION_MESSAGES, ERROR_CODES } from '../utils/constants.js';
import { ApiError } from '../utils/errors.js';

/**
 * Format reading date strictly to YYYY-MM-DD
 */
const formatDate = (val) => {
  if (val instanceof Date) {
    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(val).split('T')[0];
};

const mapReadingRow = (row) => ({
  id: row.id,
  user_id: row.user_id,
  reading_date: formatDate(row.reading_date),
  time_slot: row.time_slot,
  time_slot_label: TIME_SLOT_LABELS[row.time_slot] || row.time_slot,
  glucose_value: row.glucose_value,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const createReading = async (userId, { reading_date, time_slot, glucose_value }) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Acquire transaction-scoped advisory lock for (userId, reading_date)
    await client.query(
      'SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))',
      [userId, reading_date]
    );

    // 1. Check daily limit (Rule 4: Max 4 readings per day)
    const countRes = await client.query(
      'SELECT COUNT(*)::int as count FROM readings WHERE user_id = $1 AND reading_date = $2',
      [userId, reading_date]
    );
    if (countRes.rows[0].count >= 4) {
      throw new ApiError(400, VALIDATION_MESSAGES.DAILY_LIMIT, ERROR_CODES.DAILY_LIMIT_REACHED);
    }

    // 2. Check duplicate slot (Rule 3: Only 1 reading per slot per day)
    const duplicateRes = await client.query(
      'SELECT id FROM readings WHERE user_id = $1 AND reading_date = $2 AND time_slot = $3',
      [userId, reading_date, time_slot]
    );
    if (duplicateRes.rows.length > 0) {
      const slotLabel = TIME_SLOT_LABELS[time_slot] || time_slot;
      throw new ApiError(409, VALIDATION_MESSAGES.DUPLICATE_SLOT(slotLabel), ERROR_CODES.DUPLICATE_READING);
    }

    // 3. Insert reading
    const insertRes = await client.query(
      `INSERT INTO readings (user_id, reading_date, time_slot, glucose_value)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, reading_date, time_slot, glucose_value]
    );

    await client.query('COMMIT');
    return mapReadingRow(insertRes.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const listReadings = async (userId, { date }) => {
  let queryText = 'SELECT * FROM readings WHERE user_id = $1';
  const params = [userId];

  if (date) {
    params.push(date);
    queryText += ` AND reading_date = $${params.length}`;
  }

  queryText += ' ORDER BY reading_date DESC, created_at DESC';

  const res = await query(queryText, params);
  return res.rows.map(mapReadingRow);
};

export const getReadingById = async (userId, readingId) => {
  const res = await query(
    'SELECT * FROM readings WHERE id = $1 AND user_id = $2',
    [readingId, userId]
  );

  if (res.rows.length === 0) {
    throw new ApiError(404, 'Reading not found.', ERROR_CODES.NOT_FOUND);
  }

  return mapReadingRow(res.rows[0]);
};

export const updateReading = async (userId, readingId, { reading_date, time_slot, glucose_value }) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // 1. Fetch and row-lock existing reading to verify ownership
    const existingRes = await client.query(
      'SELECT * FROM readings WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [readingId, userId]
    );

    if (existingRes.rows.length === 0) {
      throw new ApiError(404, 'Reading not found.', ERROR_CODES.NOT_FOUND);
    }

    const existing = existingRes.rows[0];
    const oldDate = formatDate(existing.reading_date);
    const newDate = reading_date;

    // 2. Lock affected date(s) in deterministic order to prevent deadlocks
    if (oldDate === newDate) {
      await client.query(
        'SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))',
        [userId, oldDate]
      );
    } else {
      const dates = [oldDate, newDate].sort();
      await client.query(
        'SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))',
        [userId, dates[0]]
      );
      await client.query(
        'SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))',
        [userId, dates[1]]
      );

      // Check destination daily limit
      const destCountRes = await client.query(
        'SELECT COUNT(*)::int as count FROM readings WHERE user_id = $1 AND reading_date = $2',
        [userId, newDate]
      );
      if (destCountRes.rows[0].count >= 4) {
        throw new ApiError(400, VALIDATION_MESSAGES.DAILY_LIMIT, ERROR_CODES.DAILY_LIMIT_REACHED);
      }
    }

    // 3. Check for slot duplicates on destination date (excluding the current reading)
    const duplicateRes = await client.query(
      'SELECT id FROM readings WHERE user_id = $1 AND reading_date = $2 AND time_slot = $3 AND id != $4',
      [userId, newDate, time_slot, readingId]
    );

    if (duplicateRes.rows.length > 0) {
      const slotLabel = TIME_SLOT_LABELS[time_slot] || time_slot;
      throw new ApiError(409, VALIDATION_MESSAGES.DUPLICATE_SLOT(slotLabel), ERROR_CODES.DUPLICATE_READING);
    }

    // 4. Update the reading
    const updateRes = await client.query(
      `UPDATE readings
       SET reading_date = $1, time_slot = $2, glucose_value = $3, updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [newDate, time_slot, glucose_value, readingId, userId]
    );

    await client.query('COMMIT');
    return mapReadingRow(updateRes.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteReading = async (userId, readingId) => {
  const res = await query(
    'DELETE FROM readings WHERE id = $1 AND user_id = $2 RETURNING id',
    [readingId, userId]
  );

  if (res.rows.length === 0) {
    throw new ApiError(404, 'Reading not found.', ERROR_CODES.NOT_FOUND);
  }

  return { id: readingId };
};
