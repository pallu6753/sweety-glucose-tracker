# Sweety – Blood Glucose Tracker

> **"Your daily health, one reading at a time."**  
> Kenpath Technical Hiring Assignment – Junior Full Stack Developer (JavaScript & AI)  
> Submission Deadline: **15 November 2026**

---

## 1. Project Overview & Problem Statement

Managing diabetes requires disciplined tracking of blood glucose levels multiple times a day across defined mealtimes (fasting, after breakfast, after lunch, after dinner). Inconsistent or scattered logging makes it difficult for patients to notice fluctuations or share reliable data with healthcare providers.

**Sweety** is a responsive full-stack healthcare web application engineered to enable diabetes patients to log up to four daily blood glucose measurements, maintain user data isolation, detect potential data entry mistakes through validation rules, and review daily, month-to-date, and previous-month statistical reports.

---

## 2. Core Features

### Authentication & Session Security
- User registration and login with input validation.
- Password hashing using `bcrypt` (10 salt rounds).
- Stateless authentication using JSON Web Tokens (JWT) stored in secure `HttpOnly` cookies.
- Guaranteed user-level data isolation: All queries derive user identity exclusively from the verified JWT payload (`req.user.id`).
- Clean logout endpoint clearing session cookies.

### Blood Glucose Reading Management (CRUD)
- **Create**: Log readings for any of the 4 standard slots with date and glucose level (mg/dL).
- **Read**: List user readings with optional date filtering; view individual reading details.
- **Update**: Edit existing readings with transactional collision and destination date validation.
- **Delete**: Remove erroneous entries with user confirmation.

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

## 4. Software Architecture & Monorepo Structure

```
sweety-glucose-tracker/
│
├── client/                               # Frontend React + Vite Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Modal, StatCard reusable components
│   │   │   ├── layout/                  # Navbar with user badge and tabs
│   │   │   └── readings/                # ReadingFormModal, SlotIndicator, DeleteModal
│   │   ├── context/                     # AuthContext for session management
│   │   ├── pages/                       # LoginPage, RegisterPage, Dashboard, Readings, Reports
│   │   ├── services/                    # Centralized api.js client (credentials: include)
│   │   ├── test/                        # Vitest + React Testing Library tests
│   │   ├── utils/                       # Constants, slot mappings, date utilities
│   │   ├── App.jsx                      # App root with authenticated routing
│   │   ├── main.jsx
│   │   └── index.css                    # Tailwind CSS directives
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                               # Backend Express.js API
│   ├── database/
│   │   ├── migrations/                  # 001_create_users_and_readings.sql, 001_down.sql
│   │   ├── seeds/                       # Idempotent seed.js script with demo data
│   │   └── migrate.js                   # Schema migration runner
│   ├── src/
│   │   ├── config/                      # env.js (validation), db.js (PostgreSQL pool)
│   │   ├── controllers/                 # authController, readingController, reportController
│   │   ├── middleware/                  # auth.js (JWT verify), errorHandler.js
│   │   ├── routes/                      # authRoutes, readingRoutes, reportRoutes
│   │   ├── services/                    # authService, readingService, reportService
│   │   ├── utils/                       # constants.js, dateUtils.js, errors.js
│   │   ├── validators/                  # readingValidator.js, authValidator.js
│   │   ├── app.js                       # Express app configuration & middleware
│   │   └── server.js                    # Server startup & DB connection check
│   ├── tests/                           # Jest test suite (ESM, Supertest)
│   └── package.json
│
├── screenshots/                         # UI screenshots
├── .env.example                         # Environment configuration template
├── .gitignore
├── package.json                         # Root monorepo workspace orchestrator
└── README.md
```

---

## 5. Database Schema & Constraints

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

## 6. API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log in and receive HttpOnly cookie | No |
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

## 7. Prerequisites & Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22.18.0 tested)
- **npm**: v9.0.0 or higher (v10.9.3 tested)
- **PostgreSQL**: PostgreSQL 14+ (PostgreSQL 18.6 running locally on port 5432)

### Installation
Clone the repository and install all workspace dependencies from root:
```bash
git clone https://github.com/your-username/sweety-glucose-tracker.git
cd sweety-glucose-tracker
npm install
```

### Environment Configuration
Copy `.env.example` to `server/.env` and update the database password:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sweety_glucose_tracker
TEST_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sweety_glucose_tracker_test
JWT_SECRET=sweety_super_secret_jwt_key_kenpath_2026_dev_env
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Database Migration & Seeding
Create the database in PostgreSQL:
```sql
CREATE DATABASE sweety_glucose_tracker;
```
Run migrations and load the idempotent demo seed data:
```bash
npm run migrate
npm run seed
```

### Demo User Credentials
- **Email:** `demo@sweety.com`
- **Password:** `SweetyDemo2026!`

### Starting the Applications
Run both backend API (Port 5000) and frontend client (Port 5173) concurrently:
```bash
npm run dev
```
Or start them individually:
```bash
npm run server  # http://localhost:5000
npm run client  # http://localhost:5173
```

---

## 8. Automated Testing

### Backend Automated Tests (Jest & Supertest)
```bash
npm run test:server
```
Runs 22 comprehensive tests covering:
- **Validation Rules 1–5**: Mandatory integer between 40–600 mg/dL, missing value rejection, future dates rejection, slot integrity.
- **Calendar Boundaries**: Month-to-date ranges, leap year February calculations (29 days in 2024 vs 28 in 2026), and January rollover to previous year December.
- **Authentication Middleware**: Missing token, expired token, invalid token signature, cookie extraction.
- **API Contracts**: Status codes, 401 unauthenticated guards, error payload shapes.

### Frontend Automated Tests (Vitest & React Testing Library)
```bash
npm run test:client
```
Verifies:
- Live form validation on input.
- Real-time display of Rule 1, Rule 2, and Rule 3 error messages.
- Slot completion indicators and modal interactions.

---

## 9. Requirement Traceability Matrix

| Requirement ID | Description | Implementation File | Test Case | Status |
|---|---|---|---|---|
| **REQ-AUTH-01** | User Registration with validation | `server/src/controllers/authController.js` | `api.test.js` | **VERIFIED** |
| **REQ-AUTH-02** | Password hashing with bcrypt | `server/src/services/authService.js` | `authMiddleware.test.js` | **VERIFIED** |
| **REQ-AUTH-03** | JWT authentication via HttpOnly cookies | `server/src/middleware/auth.js` | `authMiddleware.test.js` | **VERIFIED** |
| **REQ-AUTH-04** | User-level data isolation | `server/src/services/readingService.js` | `api.test.js` | **VERIFIED** |
| **REQ-CRUD-01** | Complete Reading CRUD operations | `server/src/routes/readingRoutes.js` | `api.test.js` | **VERIFIED** |
| **REQ-SLOT-01** | 4 Allowed Time Slots (morning, lunch, dinner) | `server/src/utils/constants.js` | `validator.test.js` | **VERIFIED** |
| **REQ-VAL-01** | Rule 1: Value required | `server/src/validators/readingValidator.js` | `validator.test.js` | **VERIFIED** |
| **REQ-VAL-02** | Rule 2: Integer between 40 and 600 mg/dL | `server/src/validators/readingValidator.js` | `validator.test.js` | **VERIFIED** |
| **REQ-VAL-03** | Rule 3: Only 1 reading per slot per day | `server/src/validators/readingValidator.js` | `validator.test.js` | **VERIFIED** |
| **REQ-VAL-04** | Rule 4: Maximum 4 readings per day | `server/src/services/readingService.js` | `ReadingFormModal.test.jsx` | **VERIFIED** |
| **REQ-VAL-05** | Rule 5: No future dates | `server/src/utils/dateUtils.js` | `dateUtils.test.js` | **VERIFIED** |
| **REQ-CONC-01** | Advisory locking daily limit enforcement | `server/src/services/readingService.js` | Code Audit & Advisory Xact Locks | **VERIFIED** |
| **REQ-REP-01** | Daily Report with readings & slots | `server/src/services/reportService.js` | `dateUtils.test.js` | **VERIFIED** |
| **REQ-REP-02** | Month-to-date Report (1st to selected date) | `server/src/services/reportService.js` | `dateUtils.test.js` | **VERIFIED** |
| **REQ-REP-03** | Previous Full Month Report (rollover & leap year) | `server/src/services/reportService.js` | `dateUtils.test.js` | **VERIFIED** |
| **REQ-REP-04** | Friendly empty states (null stats, count 0) | `server/src/services/reportService.js` | `ReportsPage.jsx` | **VERIFIED** |
| **REQ-UI-01** | Responsive Lavender/Rose Healthcare Design | `client/src/App.jsx` | Vite Build & Vitest | **VERIFIED** |

---

## 10. License

Developed for the **Kenpath Junior Full Stack Developer (JavaScript & AI) Hiring Assignment**.
All rights reserved © 2026.
