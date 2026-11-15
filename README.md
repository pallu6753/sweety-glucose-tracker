# Sweety – Blood Glucose Tracker

> **"Your daily health, one reading at a time."**  
> Kenpath Technical Hiring Assignment – Junior Full Stack Developer (JavaScript & AI)  
> Submission Deadline: **15 November 2026**

---

## 1. Project Overview & Problem Statement

Managing diabetes requires disciplined tracking of blood glucose levels multiple times a day across defined mealtimes (fasting, after breakfast, after lunch, after dinner). Inconsistent or scattered logging makes it difficult for patients to notice fluctuations or share reliable data with healthcare providers.

**Sweety** is a responsive full-stack healthcare web application engineered to enable diabetes patients to log up to four daily blood glucose measurements, maintain user data isolation, detect potential data entry mistakes through validation rules, and review daily, month-to-date, and previous-month statistical reports.

---

## 2. Core Features & Architecture

### Public Product Landing Page
- Genuine healthcare SaaS public landing page with Hero, Features, 3-Step Routine, Interactive Dashboard Preview, Why Sweety, Interactive FAQ Accordion, and Footer.
- Clear medical disclaimers, accessible design system, and 1-Click instant demo access.

### Authentication & Session Security
- User registration and login with input validation and password visibility toggle.
- Password hashing using `bcrypt` (10 salt rounds).
- Dual-mode authentication: Stateless JWT in `HttpOnly` cookies (`SameSite=None; Secure` in production for cross-origin Render deployments) with automatic Bearer token storage companion for zero-cookie failure.
- Guaranteed user-level data isolation: All queries derive user identity exclusively from the verified JWT payload (`req.user.id`).
- Clean logout endpoint clearing session cookies and client tokens.

### Blood Glucose Reading Management (CRUD)
- **Create**: Log readings for any of the 4 standard slots with date and glucose level (mg/dL).
- **Read**: List user readings with optional date filtering; view individual reading details.
- **Update**: Edit existing readings with transactional collision and destination date validation.
- **Delete**: Remove entries with user confirmation modal.

### 4 Mandatory Time Slots
1. **Morning (fasting)** (`morning`)
2. **After breakfast** (`after_breakfast`)
3. **After lunch** (`after_lunch`)
4. **After dinner** (`after_dinner`)

### 5 Mandatory Validation Rules
1. **Rule 1 (Value Required)**: `Please enter a glucose value.`
2. **Rule 2 (Numeric Range & Format)**: `Value must be between 40 and 600 mg/dl.` (Rejects decimals, negative numbers, strings, NaN, values < 40 or > 600).
3. **Rule 3 (Duplicate Slot Prevention)**: `You already have an {Slot label} reading for this date.` (e.g., `You already have an After lunch reading for this date.`).
4. **Rule 4 (Daily Reading Maximum)**: `You can add only 4 readings per day.`
5. **Rule 5 (No Future Dates)**: `Date cannot be in the future.`

### Concurrency & Data Integrity
- Transaction-scoped PostgreSQL advisory locks (`pg_advisory_xact_lock(hashtext(user_id::text), hashtext(reading_date::text))`) guarantee that concurrent requests cannot exceed the 4-reading daily limit or insert duplicate slots.
- Updates safely lock both source and destination calendar dates in deterministic sorted order to prevent race conditions or database deadlocks.

### Reporting Engine
- **Daily Report**: Aggregates selected date (Highest, Lowest, Average rounded to 1 decimal, Count) and lists individual readings in chronological mealtime order.
- **Month-to-Date Report**: Calculates aggregated metrics from the 1st of the selected month through the selected date inclusive.
- **Monthly Report (Previous Calendar Month)**: Calculates full previous calendar month statistics, handling December-to-January year transitions and leap years (February 29th).
- **Friendly Empty States**: Returns null metrics and 0 counts when no data exists, preventing deceptive zero readings.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite 6 | Modern, component-based user interface |
| **Styling** | Tailwind CSS 3 | Soft lavender & rose healthcare SaaS aesthetic |
| **Icons & Charts** | Lucide React, Recharts | Accessible medical UI icons & trend charts |
| **Backend** | Node.js (v22), Express.js (v4) | RESTful API server with modular controllers & services |
| **Database** | PostgreSQL 18 | Relational persistence with constraints & advisory locks |
| **Auth & Security** | bcrypt, jsonwebtoken, helmet, cors | Cryptographic password hashing & HttpOnly JWT cookies |
| **Testing** | Jest, Supertest, Vitest, React Testing Library | Unit, contract, boundary, and frontend validation tests |

---

## 4. Database Schema & Constraints

```mermaid
erDiagram
    users ||--o{ readings : "logs"
    users {
        uuid id PK "gen_random_uuid()"
        varchar(100) name "NOT NULL"
        varchar(255) email "NOT NULL UNIQUE"
        text password_hash "NOT NULL"
        timestamptz created_at "DEFAULT NOW()"
        timestamptz updated_at "DEFAULT NOW()"
    }
    readings {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "REFERENCES users(id) ON DELETE CASCADE"
        date reading_date "NOT NULL"
        varchar(30) time_slot "NOT NULL"
        integer glucose_value "NOT NULL"
        timestamptz created_at "DEFAULT NOW()"
        timestamptz updated_at "DEFAULT NOW()"
    }
```

### Constraints & Indexes
- `check_glucose_value`: `CHECK (glucose_value >= 40 AND glucose_value <= 600)`
- `check_time_slot`: `CHECK (time_slot IN ('morning', 'after_breakfast', 'after_lunch', 'after_dinner'))`
- `uq_user_date_slot`: `UNIQUE (user_id, reading_date, time_slot)`
- `idx_users_email`: B-tree index on `users(email)`
- `idx_readings_user_date`: Composite index on `readings(user_id, reading_date)`
- `idx_readings_user_date_slot`: Index on `readings(user_id, reading_date, time_slot)`

---

## 5. API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log in and receive HttpOnly cookie + token | No |
| `POST` | `/api/auth/logout` | Clear authentication session | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### Reading CRUD Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/readings` | Create a new glucose reading | Yes |
| `GET` | `/api/readings?date=YYYY-MM-DD` | List readings (optional date filter) | Yes |
| `GET` | `/api/readings/:id` | Retrieve reading by ID | Yes |
| `PUT` | `/api/readings/:id` | Update existing reading | Yes |
| `DELETE` | `/api/readings/:id` | Delete reading by ID | Yes |

### Reporting Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/reports/daily?date=YYYY-MM-DD` | Daily stats + chronological slot list | Yes |
| `GET` | `/api/reports/month-to-date?date=YYYY-MM-DD` | Month-to-date aggregated statistics | Yes |
| `GET` | `/api/reports/monthly?date=YYYY-MM-DD` | Full previous calendar month stats | Yes |

---

## 6. Prerequisites & Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22 tested)
- **npm**: v9.0.0 or higher (v10 tested)
- **PostgreSQL**: PostgreSQL 14+ (PostgreSQL 18 running on port 5432)

### Installation
```bash
git clone https://github.com/pallu6753/sweety-glucose-tracker.git
cd sweety-glucose-tracker
npm install
```

### Environment Configuration
Copy `.env.example` to `server/.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://sweety_app:YOUR_PASSWORD@localhost:5432/sweety_glucose_tracker
TEST_DATABASE_URL=postgresql://sweety_app:YOUR_PASSWORD@localhost:5432/sweety_glucose_tracker_test
JWT_SECRET=sweety_super_secret_jwt_key_kenpath_2026_dev_env
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Database Migration & Seeding
```bash
npm run migrate
npm run seed
```

### Demo User Credentials
- **Email:** `demo@sweety.com`
- **Password:** `SweetyDemo2026!`
*(Or click the 1-Click Demo Account button on the login screen or landing page)*

### Starting the Applications
Run both backend API (Port 5000) and frontend client (Port 5173) concurrently:
```bash
npm run dev
```

---

## 7. Automated Testing (40/40 Passing)

### Complete Test Run
```bash
npm run test
```

### Backend Automated Tests (Jest & Supertest - 31/31 Passing)
```bash
npm run test:server
```
Covers:
- **Validation Rules 1–5**: Mandatory integer between 40–600 mg/dL, missing value rejection, future dates rejection, slot integrity.
- **Calendar Boundaries**: Month-to-date ranges, leap year February calculations (29 days in 2024 vs 28 in 2026), and January rollover to previous year December.
- **Authentication Middleware**: Missing token, expired token, invalid token signature, cookie extraction.
- **Live PostgreSQL Integration Tests**: User registration, password hashing in DB, cookie verification, reading creation, Rule 3 duplicate prevention, Rule 4 daily limits, and user data isolation.

### Frontend Automated Tests (Vitest & React Testing Library - 9/9 Passing)
```bash
npm run test:client
```
Covers:
- **LandingPage Component**: Header, CTA callbacks, features, 3-step routine, interactive FAQ accordion.
- **ReadingFormModal Component**: Rule 1 required value, Rule 2 numeric range [40, 600], Rule 3 duplicate slot error display.
- **AuthPages Component**: Registration password matching validation, weak password format rejection, and 1-click Demo Account login triggering.

---

## 8. Deployment on Render

### Backend Web Service
- **Root Directory:** `server`
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm run migrate && npm start`
- **Required Environment Variables:**
  - `NODE_ENV`: `production`
  - `DATABASE_URL`: `postgresql://...` (from Render PostgreSQL)
  - `JWT_SECRET`: High-entropy 64-char string (generated via `node src/utils/generateSecret.js`)
  - `CLIENT_URL`: URL of deployed frontend (e.g. `https://sweety-glucose-tracker.onrender.com`)

### Frontend Static Site
- **Root Directory:** `client`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: Backend service URL (e.g. `https://sweety-glucose-api-9w7c.onrender.com`)

---

## 9. Feature Implementation Status

| Feature / Capability | Status | Implementation Details |
|---|---|---|
| **Public Landing Page** | **COMPLETED AND VERIFIED** | Complete SaaS landing page with Hero, Features, How It Works, Live Preview, Why Sweety, FAQ accordion, Footer, and working navigation. |
| **Reading Creation & Form Fix** | **COMPLETED AND VERIFIED** | Fixed root cause (`editingReading?.id` guard against `PUT /undefined`), Rule 1-5 preserved, PostgreSQL UUID parameter validated. |
| **Authentication System** | **COMPLETED AND VERIFIED** | Registration with full name, email, password strength, confirm password check, HttpOnly cookies, and Bearer fallback. |
| **Dashboard Redesign** | **COMPLETED AND VERIFIED** | Welcome banner, live statistics cards, 4-slot mealtime visual indicator, quick action bar, and daily glucose progression chart. |
| **Reading CRUD & Validation** | **COMPLETED AND VERIFIED** | Create, view, edit, delete with confirmation modal. All 5 validation rules strictly enforced. |
| **Reports Engine** | **COMPLETED AND VERIFIED** | Daily, Month-to-Date, and Previous Full Month reports with stats, empty states, and BarChart trends. |
| **Code Splitting & Performance** | **COMPLETED AND VERIFIED** | Dynamic imports via `React.lazy` and manual chunks (`react-vendor`, `d3-vendor`, `recharts`, `icons`). Bundle size optimized. |
| **Automated Test Suite** | **COMPLETED AND VERIFIED** | 31/31 Jest backend tests + 9/9 Vitest frontend tests (40 total) executing and passing cleanly. |
| **Google OAuth 2.0 Integration** | **IMPLEMENTED BUT NEEDS EXTERNAL CONFIGURATION** | Backend OAuth verification and UI buttons prepared with honest disabled state notice. Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Google Cloud Console. |
| **Email OTP & Password Reset** | **IMPLEMENTED BUT NEEDS EXTERNAL CONFIGURATION** | Token generation and recovery routing prepared. Requires SMTP configuration (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) via SendGrid or Resend. |

---

## 10. License

Developed for the **Kenpath Junior Full Stack Developer (JavaScript & AI) Hiring Assignment**.
All rights reserved © 2026.
