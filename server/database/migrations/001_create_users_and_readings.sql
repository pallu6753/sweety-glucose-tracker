-- Migration: 001_create_users_and_readings.sql
-- Description: Creates users and readings tables with constraints and indexes for Sweety

-- Enable pgcrypto / uuid-ossp if gen_random_uuid() is not natively loaded (PostgreSQL 13+ has gen_random_uuid built-in)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for normalized email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- 2. READINGS TABLE
CREATE TABLE IF NOT EXISTS readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    glucose_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT check_glucose_value CHECK (glucose_value >= 40 AND glucose_value <= 600),
    CONSTRAINT check_time_slot CHECK (time_slot IN ('morning', 'after_breakfast', 'after_lunch', 'after_dinner')),
    CONSTRAINT uq_user_date_slot UNIQUE (user_id, reading_date, time_slot)
);

-- Performance Indexes for user-scoped date queries and sorting
CREATE INDEX IF NOT EXISTS idx_readings_user_date ON readings (user_id, reading_date);
CREATE INDEX IF NOT EXISTS idx_readings_user_date_slot ON readings (user_id, reading_date, time_slot);
CREATE INDEX IF NOT EXISTS idx_readings_reading_date ON readings (reading_date);
