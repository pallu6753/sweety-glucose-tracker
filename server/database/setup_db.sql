-- ==============================================================
-- Sweety Glucose Tracker – Dedicated Database & Role Setup
-- ==============================================================
-- Run this script in an authenticated PostgreSQL administrator session
-- (such as pgAdmin 4 Query Tool or SQL Shell / psql as postgres)
-- 
-- IMPORTANT: Replace 'YOUR_STRONG_LOCAL_PASSWORD' with your own secret password.
-- DO NOT share or commit this password.
-- ==============================================================

-- 1. Create the dedicated application user
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sweety_app'
   ) THEN
      CREATE ROLE sweety_app WITH LOGIN PASSWORD 'YOUR_STRONG_LOCAL_PASSWORD';
   ELSE
      ALTER ROLE sweety_app WITH PASSWORD 'YOUR_STRONG_LOCAL_PASSWORD';
   END IF;
END
$do$;

-- 2. Create the application database owned by sweety_app
SELECT 'CREATE DATABASE sweety_glucose_tracker OWNER sweety_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sweety_glucose_tracker')\gexec

-- 3. Create the test database owned by sweety_app
SELECT 'CREATE DATABASE sweety_glucose_tracker_test OWNER sweety_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sweety_glucose_tracker_test')\gexec

-- 4. Grant full privileges
GRANT ALL PRIVILEGES ON DATABASE sweety_glucose_tracker TO sweety_app;
GRANT ALL PRIVILEGES ON DATABASE sweety_glucose_tracker_test TO sweety_app;
