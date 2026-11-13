import bcrypt from 'bcrypt';
import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../../src/config/env.js';

const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'test' ? config.testDatabaseUrl : config.databaseUrl,
});

export const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('[SEED] Starting database seeding...');
    await client.query('BEGIN');

    // 1. Create or retrieve Demo User
    const demoEmail = 'demo@sweety.com';
    const demoPassword = 'SweetyDemo2026!';
    const demoName = 'Demo Patient';
    const passwordHash = await bcrypt.hash(demoPassword, 10);

    let userResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [demoEmail]
    );

    let userId;
    if (userResult.rows.length === 0) {
      const newUser = await client.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [demoName, demoEmail, passwordHash]
      );
      userId = newUser.rows[0].id;
      console.log(`[SEED] Created demo user with ID: ${userId}`);
    } else {
      userId = userResult.rows[0].id;
      console.log(`[SEED] Found existing demo user with ID: ${userId}`);
    }

    // 2. Generate comprehensive readings for reports:
    // Today: 2026-11-13
    // Include:
    // - Today (3 readings)
    // - Current Month to date (Nov 1 to Nov 12: various readings)
    // - Previous Month (October 2026: complete month data for previous-month report)
    const readings = [
      // Today: 2026-11-13
      { date: '2026-11-13', slot: 'morning', value: 104 },
      { date: '2026-11-13', slot: 'after_breakfast', value: 138 },
      { date: '2026-11-13', slot: 'after_lunch', value: 122 },

      // Yesterday: 2026-11-12
      { date: '2026-11-12', slot: 'morning', value: 98 },
      { date: '2026-11-12', slot: 'after_breakfast', value: 142 },
      { date: '2026-11-12', slot: 'after_lunch', value: 118 },
      { date: '2026-11-12', slot: 'after_dinner', value: 130 },

      // Earlier November 2026 (Month-to-Date)
      { date: '2026-11-10', slot: 'morning', value: 110 },
      { date: '2026-11-10', slot: 'after_lunch', value: 126 },
      { date: '2026-11-08', slot: 'morning', value: 95 },
      { date: '2026-11-08', slot: 'after_dinner', value: 140 },
      { date: '2026-11-05', slot: 'morning', value: 102 },
      { date: '2026-11-05', slot: 'after_breakfast', value: 135 },
      { date: '2026-11-01', slot: 'morning', value: 108 },

      // October 2026 (Full Previous Month)
      { date: '2026-10-31', slot: 'morning', value: 100 },
      { date: '2026-10-31', slot: 'after_dinner', value: 145 },
      { date: '2026-10-25', slot: 'morning', value: 115 },
      { date: '2026-10-25', slot: 'after_lunch', value: 130 },
      { date: '2026-10-20', slot: 'morning', value: 92 },
      { date: '2026-10-20', slot: 'after_breakfast', value: 128 },
      { date: '2026-10-15', slot: 'morning', value: 105 },
      { date: '2026-10-15', slot: 'after_lunch', value: 132 },
      { date: '2026-10-10', slot: 'morning', value: 99 },
      { date: '2026-10-10', slot: 'after_dinner', value: 150 },
      { date: '2026-10-05', slot: 'morning', value: 112 },
      { date: '2026-10-01', slot: 'morning', value: 96 },
      { date: '2026-10-01', slot: 'after_breakfast', value: 124 },
    ];

    let insertedCount = 0;
    for (const r of readings) {
      const result = await client.query(
        `INSERT INTO readings (user_id, reading_date, time_slot, glucose_value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, reading_date, time_slot)
         DO UPDATE SET glucose_value = EXCLUDED.glucose_value
         RETURNING id`,
        [userId, r.date, r.slot, r.value]
      );
      if (result.rows.length > 0) {
        insertedCount++;
      }
    }

    await client.query('COMMIT');
    console.log(`[SEED] Seeding completed. Inserted/updated ${insertedCount} readings.`);
    console.log('[SEED] Demo User Credentials:');
    console.log(`       Email:    ${demoEmail}`);
    console.log(`       Password: ${demoPassword}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[SEED ERROR] Failed to seed database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
