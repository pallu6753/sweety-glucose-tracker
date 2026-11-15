# Sweety – Blood Glucose Tracker

[![CI Test Suite](https://img.shields.io/badge/Tests-41%20Passed%20%2F%2041%20Total-success?style=flat-square&logo=jest)](https://github.com/pallu6753/sweety-glucose-tracker)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%20--%20v22-blue?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-v18-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **"Your daily health, one reading at a time."**  
> A production-ready, full-stack healthcare web application engineered for disciplined blood glucose logging, strict clinical boundary validation, and multi-period statistical reporting.

---

## Table of Contents

1. [Project Title & Introduction](#1-project-title--introduction)
2. [Project Overview](#2-project-overview)
3. [Company & Assignment Context](#3-company--assignment-context)
4. [Live Application & GitHub Links](#4-live-application--github-links)
5. [Screenshots & Application Preview](#5-screenshots--application-preview)
6. [Key Features](#6-key-features)
7. [Technology Stack](#7-technology-stack)
8. [System Architecture](#8-system-architecture)
9. [Application Workflow](#9-application-workflow)
10. [Database Design](#10-database-design)
11. [Authentication & Security](#11-authentication--security)
12. [Input Validation (5 Clinical Rules)](#12-input-validation-5-clinical-rules)
13. [API Endpoints](#13-api-endpoints)
14. [Reporting Functionality](#14-reporting-functionality)
15. [Project Folder Structure](#15-project-folder-structure)
16. [Installation & Local Setup](#16-installation--local-setup)
17. [PostgreSQL Database Configuration](#17-postgresql-database-configuration)
18. [Database Migrations](#18-database-migrations)
19. [Seed Script & Demo Account Instructions](#19-seed-script--demo-account-instructions)
20. [Environment Variables](#20-environment-variables)
21. [Testing Instructions](#21-testing-instructions)
22. [Actual Test Results](#22-actual-test-results)
23. [Deployment Information](#23-deployment-information)
24. [Assumptions & Limitations](#24-assumptions--limitations)
25. [Future Improvements](#25-future-improvements)
26. [Author & Project Credits](#26-author--project-credits)

---

## 1. Project Title & Introduction

**Sweety** is a modern, responsive full-stack blood glucose tracking web application. It empowers individuals managing diabetes or pre-diabetes to record, organize, and analyze their glucose readings across four standardized daily mealtime intervals: **Morning (fasting)**, **After breakfast**, **After lunch**, and **After dinner**.

Built with a strong emphasis on data integrity, concurrency protection, and healthcare-grade user experience, Sweety prevents erroneous entries through strict validation constraints, maintains complete cryptographic isolation between patient accounts, and generates actionable daily, month-to-date, and previous-calendar-month reports.

---

## 2. Project Overview

Managing diabetes is fundamentally an exercise in consistent measurement and trend recognition. Clinicians require glucose metrics captured at specific biological milestones relative to caloric intake. In practice, patients face several challenges:
- **Disorganized record-keeping**: Scattered notes or unstructured spreadsheets lead to gaps and lost historical trends.
- **Accidental entry errors**: Transposed numbers, negative values, out-of-range figures, or duplicate mealtime slots corrupt clinical averages.
- **Data security concerns**: Personal biometric health records require rigorous cryptographic protection and tenant isolation.

**Sweety solves these challenges** by providing:
1. A structured logging system strictly bound to four clinical time slots per day.
2. Automated enforcement of five business validation rules at both frontend and database layers.
3. Transactional PostgreSQL advisory locks preventing race conditions or duplicate entries during concurrent requests.
4. Comprehensive statistical engines calculating highest, lowest, and average glucose levels across multiple time horizons.
5. An accessible, human-centered UI designed in soft lavender and rose palettes with instant 1-click evaluation access.

---

## 3. Company & Assignment Context

- **Hiring Organization**: **Kenpath**
- **Target Position**: **Junior Full Stack Developer – JavaScript & AI (Bangalore)**
- **Assignment Type**: Technical Hiring Project Submission
- **Deadline**: 15 November 2026

### Assignment Mandate
Develop a full-stack blood glucose tracking application adhering to strict engineering specifications:
- Full-stack JavaScript architecture using React and Node.js / Express.
- Persistent relational storage with PostgreSQL, including transactional integrity and relational constraints.
- Cryptographic authentication with salted `bcrypt` hashing and stateless JWT tokens.
- Strict validation enforcing four designated mealtime slots, boundary limits `[40, 600] mg/dL`, duplicate prevention, and future-date rejection.
- Comprehensive reporting engines supporting daily, month-to-date, and full previous-month statistics.
- Automated testing verifying unit, API contract, calendar edge cases, and PostgreSQL integration flows.

---

## 4. Live Application & GitHub Links

| Resource | URL | Status |
| :--- | :--- | :---: |
| **Live Frontend Application** | [https://sweety-glucose-frontend.onrender.com/](https://sweety-glucose-frontend.onrender.com/) | Live |
| **Backend Express API** | [https://sweety-glucose-api-9w7c.onrender.com/api](https://sweety-glucose-api-9w7c.onrender.com/api) | Live |
| **API Health Status** | [https://sweety-glucose-api-9w7c.onrender.com/api/health](https://sweety-glucose-api-9w7c.onrender.com/api/health) | Live |
| **GitHub Source Repository** | [https://github.com/pallu6753/sweety-glucose-tracker](https://github.com/pallu6753/sweety-glucose-tracker) | Public |

---

## 5. Screenshots & Application Preview

The Sweety user interface is designed with a modern healthcare aesthetic inspired by contemporary SaaS products, prioritizing clarity, calm visual tones, and responsive accessibility across mobile, tablet, and desktop screens.

| # | Screen / Feature | Description | Status |
| :---: | :--- | :--- | :---: |
| **1** | **Landing Page** | Public marketing page with Hero, 4-Slot Features, How It Works, Interactive FAQ accordion, and 1-Click Demo CTA | Ready on Live App |
| **2** | **Registration Page** | Patient onboarding with real-time password strength validation, confirmation matching, and clear error alerts | Ready on Live App |
| **3** | **Login Page** | Secure authentication with password visibility toggle and ⚡ 1-Click Instant Demo access | Ready on Live App |
| **4** | **Dashboard** | Primary patient workspace featuring KPI summary cards, today's mealtime status badges, and glucose trend chart | Ready on Live App |
| **5** | **Add Reading Modal** | Quick entry dialog enforcing 4 designated slots, date picker, integer boundaries `[40, 600]`, and instant feedback | Ready on Live App |
| **6** | **Readings Timeline** | Chronological reading history with date filtering, slot indicators, and contextual action menus | Ready on Live App |
| **7** | **Edit Reading Modal** | In-place reading modification with transactional collision detection and boundary checks | Ready on Live App |
| **8** | **Validation Alerts** | Human-readable alert banners enforcing Rules 1–5 (e.g. duplicate slot warning, out-of-range rejection) | Ready on Live App |
| **9** | **Daily Report** | Single-date aggregate metrics (Average to 1 decimal, Peak, Minimum, Count) and chronological slot sequence | Ready on Live App |
| **10** | **Month-to-Date Report** | Cumulative statistics from the 1st of the month through selected date with bar chart visual trends | Ready on Live App |
| **11** | **Monthly Report** | Complete previous-calendar-month analytics with leap-year and year-rollover boundary safety | Ready on Live App |
| **12** | **Mobile Interface** | Fully responsive layout with mobile drawer navigation, touch-friendly tap targets, and responsive tables | Ready on Live App |

> [!TIP]
> Evaluators can interact with all 12 views directly on the live production site at [sweety-glucose-frontend.onrender.com](https://sweety-glucose-frontend.onrender.com/) by clicking **"⚡ Try Demo Account (1-Click)"**.

---

## 6. Key Features

### 👤 User Authentication & Tenant Isolation
- Secure account registration with full name, email format validation, and alphanumeric password requirements (minimum 8 characters).
- Cryptographic password hashing using `bcrypt` (10 salt rounds).
- Dual-mode authentication: Stateless JWT in `HttpOnly` cookies (`SameSite=None; Secure` in production) with automatic Bearer token companion in `localStorage` for resilient cross-origin support.
- Complete data isolation: all SQL queries derive tenant identity exclusively from the verified JWT payload (`req.user.id`).
- Clean session logout endpoint clearing cookies and client tokens.

### 🩸 4-Slot Daily Glucose Management
- Dedicated recording slots representing standard clinical testing milestones:
  1. `morning` – **Morning (fasting)**
  2. `after_breakfast` – **After breakfast**
  3. `after_lunch` – **After lunch**
  4. `after_dinner` – **After dinner**
- Full CRUD capabilities: create readings, list readings with optional date filtering, fetch individual reading details, update readings, and delete readings with confirmation modals.

### 🛡️ Concurrency & Transactional Data Integrity
- Transaction-scoped PostgreSQL advisory locks (`pg_advisory_xact_lock`) guarantee that rapid concurrent requests cannot bypass the 4-reading daily limit or create duplicate mealtime slots.
- Updates lock both source and destination calendar dates in deterministic sorted order to prevent deadlocks and race conditions.

### 📊 Advanced Reporting Engine
- **Daily Report**: Aggregates readings for any selected date, reporting count, average (rounded to 1 decimal), highest peak, lowest minimum, and individual mealtime records in logical order.
- **Month-to-Date Report**: Computes aggregate metrics from the 1st day of the selected month up to and including the selected date.
- **Monthly Report (Previous Calendar Month)**: Calculates full previous calendar month statistics, handling December-to-January year transitions and leap years (February 29th) seamlessly.
- **Empty-State Safety**: Returns explicit null metrics and zero counts when no data exists, preventing misleading zero averages.

---

## 7. Technology Stack

Verified technology components present in the project repository:

| Layer | Technology | Version | Purpose in Sweety |
| :--- | :--- | :---: | :--- |
| **Language** | JavaScript (ES6+ / ESM) | Modern | Unified language across client, server, migrations, and test suites |
| **Language** | SQL (PostgreSQL Dialect) | ANSI/PG | Relational schema definitions, constraints, indexes, and queries |
| **Frontend Framework** | React | `^18.3.1` | Component-based, state-driven user interface |
| **Build Tool** | Vite | `^6.0.1` | High-performance build tool, HMR dev server, and Rollup bundler |
| **Styling** | Tailwind CSS | `^3.4.17` | Utility-first responsive design system with custom healthcare tokens |
| **Icons** | Lucide React | `^1.16.0` | Accessible, tree-shakeable SVG medical and navigation icons |
| **Data Visualization** | Recharts | `^2.15.0` | Responsive SVG bar charts and glucose trend visualizations |
| **Backend Runtime** | Node.js | `>=18.0.0` | Asynchronous event-driven server runtime (v20+ in production) |
| **Backend Framework** | Express.js | `^4.21.2` | RESTful API routing, middleware chaining, and HTTP request handling |
| **Database** | PostgreSQL | `14+ / 18` | Persistent relational database with transactions and constraints |
| **Database Driver** | `pg` (node-postgres) | `^8.13.1` | Connection pooling and parameterized SQL query execution |
| **Authentication** | `jsonwebtoken` | `^9.0.2` | Cryptographic JWT token signing, claims verification, and expiry |
| **Password Security** | `bcrypt` | `^5.1.1` | One-way password hashing with adaptive work factor (10 salt rounds) |
| **Security Headers** | `helmet` | `^8.0.0` | Standard HTTP security headers (CSP, HSTS, X-Content-Type-Options) |
| **CORS Middleware** | `cors` | `^2.8.5` | Cross-origin resource sharing with credential support |
| **Rate Limiter** | `express-rate-limit` | `^7.5.0` | Brute-force protection on authentication routes |
| **Cookie Parsing** | `cookie-parser` | `^1.4.7` | Secure extraction of HttpOnly authentication cookies |
| **Backend Testing** | Jest | `^29.7.0` | Test runner, assertions, and mock execution for server tests |
| **API Integration Testing** | Supertest | `^7.0.0` | HTTP assertion library for integration testing against Express routes |
| **Frontend Testing** | Vitest | `^5.1.0` | Vite-native unit test runner for client components |
| **DOM Testing** | React Testing Library | `^16.1.0` | User-centric DOM testing and accessible element queries |
| **DOM Environment** | `jsdom` | `^25.0.1` | Headless browser environment for client tests |
| **Cloud Hosting** | Render | Managed | Static site hosting, Express web service, and managed PostgreSQL |

---

## 8. System Architecture

Sweety is organized as an enterprise-grade client-server architecture with clear separation of concerns:

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React + Vite + Tailwind CSS)"]
        UI["Landing Page / Dashboard / Readings / Reports"]
        AuthCtx["AuthContext (Session State)"]
        APIClient["API Service Layer (Dual-Mode: Cookie + Bearer)"]
        UI --> AuthCtx
        AuthCtx --> APIClient
    end

    subgraph Server["Backend API Server (Node.js + Express)"]
        SecMiddleware["Security Middlewares (Helmet, CORS, RateLimit)"]
        AuthMiddleware["JWT Authentication Middleware (Cookie / Bearer)"]
        Controllers["Auth / Reading / Report Controllers"]
        Validators["Input Validation (Rules 1-5 & Dates)"]
        Services["Business Services & PostgreSQL Advisory Locks"]
        
        SecMiddleware --> AuthMiddleware
        AuthMiddleware --> Controllers
        Controllers --> Validators
        Validators --> Services
    end

    subgraph Database["Relational Storage (PostgreSQL)"]
        UsersTbl[("users Table")]
        ReadingsTbl[("readings Table")]
        MigrationsTbl[("schema_migrations Table")]
        AdvisoryLocks["pg_advisory_xact_lock"]
    end

    APIClient -->|HTTPS REST API Requests| SecMiddleware
    Services -->|Parameterized SQL / Transactions| UsersTbl
    Services -->|Parameterized SQL / Transactions| ReadingsTbl
    Services -->|Concurrency Control| AdvisoryLocks
```

---

## 9. Application Workflow

### 1. Authentication & Onboarding Workflow
```mermaid
sequenceDiagram
    autonumber
    actor User as Patient / Evaluator
    participant Frontend as React Client
    participant API as Express Server
    participant DB as PostgreSQL

    User->>Frontend: Click "⚡ Try Demo Account" or Submit Login
    Frontend->>API: POST /api/auth/login { email, password }
    API->>DB: SELECT id, password_hash FROM users WHERE email = $1
    DB-->>API: User record returned
    API->>API: bcrypt.compare(password, password_hash)
    API->>API: jwt.sign({ id, email, name }, JWT_SECRET)
    API-->>Frontend: HTTP 200 { user, token } + Set-Cookie: token (HttpOnly)
    Frontend->>Frontend: Save token in localStorage & update AuthContext
    Frontend->>User: Render Authenticated Dashboard
```

### 2. Reading Creation & Validation Workflow
```mermaid
sequenceDiagram
    autonumber
    actor User as Patient
    participant Frontend as React Client
    participant API as Express Server
    participant DB as PostgreSQL

    User->>Frontend: Submit Reading { date, slot, value }
    Frontend->>Frontend: Client Validation (Rules 1, 2, 5)
    Frontend->>API: POST /api/readings (with Bearer Token / Cookie)
    API->>API: Verify JWT -> extract req.user.id
    API->>API: Server Validation (Rules 1 - 5)
    API->>DB: BEGIN TRANSACTION
    API->>DB: SELECT pg_advisory_xact_lock(user_id, date)
    API->>DB: SELECT COUNT(*) FROM readings WHERE user_id = $1 AND reading_date = $2
    alt Count >= 4 (Rule 4 Violation)
        API->>DB: ROLLBACK
        API-->>Frontend: HTTP 400 "You can add only 4 readings per day."
    else Slot already exists (Rule 3 Violation)
        API->>DB: ROLLBACK
        API-->>Frontend: HTTP 400 "You already have an {Slot} reading for this date."
    else Valid Reading
        API->>DB: INSERT INTO readings (...) VALUES (...)
        API->>DB: COMMIT
        API-->>Frontend: HTTP 201 Created { reading }
        Frontend->>User: Update Dashboard & Timeline View
    end
```

---

## 10. Database Design

The relational database uses PostgreSQL with strong constraints, foreign keys, and indexes.

### Entity-Relationship Diagram

```mermaid
erDiagram
    users ||--o{ readings : "owns"
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
    schema_migrations {
        serial id PK
        varchar(255) migration_name "NOT NULL UNIQUE"
        timestamptz applied_at "DEFAULT NOW()"
    }
```

### Table Definitions & Integrity Constraints

#### `users` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique immutable user identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | Patient full name |
| `email` | `VARCHAR(255)` | `NOT NULL UNIQUE` | Normalized lowercase email address |
| `password_hash` | `TEXT` | `NOT NULL` | One-way salted `bcrypt` hash (10 rounds) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Record update timestamp |

#### `readings` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique reading identifier |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Owner user identifier |
| `reading_date` | `DATE` | `NOT NULL` | Reading date in `YYYY-MM-DD` |
| `time_slot` | `VARCHAR(30)` | `NOT NULL` | One of 4 designated mealtime slots |
| `glucose_value` | `INTEGER` | `NOT NULL` | Whole blood glucose level in mg/dL |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of logging |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of modification |

#### Database Constraints & Indexes
- **`check_glucose_value`**: `CHECK (glucose_value >= 40 AND glucose_value <= 600)`
- **`check_time_slot`**: `CHECK (time_slot IN ('morning', 'after_breakfast', 'after_lunch', 'after_dinner'))`
- **`uq_user_date_slot`**: `UNIQUE (user_id, reading_date, time_slot)`
- **`idx_users_email`**: B-tree index on `users(email)` for fast credential lookup.
- **`idx_readings_user_date`**: Composite index on `readings(user_id, reading_date)` for fast day and report filtering.
- **`idx_readings_user_date_slot`**: Composite index on `readings(user_id, reading_date, time_slot)`.

---

## 11. Authentication & Security

Sweety adopts defense-in-depth security principles across all layers:

1. **Password Hashing**: Passwords are never stored in plaintext. They are hashed using `bcrypt` with 10 salt rounds.
2. **Stateless JWT Tokens**: Signed using `HS256` with a high-entropy secret. Tokens contain only non-sensitive claims (`id`, `email`, `name`) and expire after 7 days (`JWT_EXPIRES_IN=7d`).
3. **Dual-Mode Authentication**:
   - **HttpOnly Cookies**: In production, cookies are issued with `HttpOnly: true`, `Secure: true`, and `SameSite: 'none'` to enable cross-site session persistence between decoupled Render domains.
   - **Bearer Authorization Header Fallback**: The frontend simultaneously stores the token in `localStorage` (`sweety_auth_token`) and attaches `Authorization: Bearer <token>` on all requests, preventing silent auth failure in browsers blocking third-party cookies (e.g. Safari ITP, Brave).
4. **Tenant Isolation**: Every SQL query accesses user data exclusively via parameterized `WHERE user_id = $1` with `$1` extracted from the cryptographically verified JWT payload. A user cannot read, update, or delete any record belonging to another user.
5. **SQL Injection Protection**: All database queries use parameterized SQL placeholders (`$1, $2, ...`), preventing SQL injection.
6. **HTTP Security Headers**: `helmet()` automatically configures secure headers including Content Security Policy, X-Content-Type-Options, and Referrer-Policy.
7. **Rate Limiting**: `express-rate-limit` throttles authentication endpoints (`/api/auth/*`) to a maximum of 100 requests per 15-minute window per IP.

---

## 12. Input Validation (5 Clinical Rules)

Sweety strictly implements and verifies the five mandatory validation rules:

| Rule | Specification | Error Message | Enforced Layers |
| :---: | :--- | :--- | :--- |
| **Rule 1** | **Value Required**<br>Glucose measurement cannot be empty, null, or whitespace. | `"Please enter a glucose value."` | Client Modal + Server Validator + DB `NOT NULL` |
| **Rule 2** | **Boundary & Integer Range**<br>Must be a whole number between 40 and 600 mg/dL inclusive. Rejects floats, negatives, strings, and out-of-bound integers. | `"Value must be between 40 and 600 mg/dl."` | Client Modal + Server Validator + DB `CHECK` constraint |
| **Rule 3** | **Duplicate Slot Prevention**<br>A patient cannot log more than one reading for the same mealtime slot on the same calendar date. | `"You already have an {Slot label} reading for this date."` | Client Modal + Server Transaction + DB `UNIQUE` constraint |
| **Rule 4** | **Daily Maximum Limit**<br>A patient can record at most 4 readings per calendar date. | `"You can add only 4 readings per day."` | Client Modal + Server Advisory Lock + Transaction count |
| **Rule 5** | **No Future Dates**<br>Readings cannot have calendar dates beyond the current local date. | `"Date cannot be in the future."` | Client Modal + Server Date Utility |

---

## 13. API Endpoints

All endpoints return uniform JSON responses:
- **Success**: `{ "success": true, "message": "...", "data": { ... } }`
- **Error**: `{ "success": false, "message": "...", "code": "...", "errors": [ ... ] }`

### Public & Authentication Routes
| Method | Route | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/health` | Service health status & PostgreSQL connectivity | No | `200`, `503` |
| `POST` | `/api/auth/register` | Register new user account | No | `201`, `400`, `409` |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT cookie/token | No | `200`, `400`, `401` |
| `POST` | `/api/auth/logout` | Clear authentication cookie & session | No | `200` |
| `GET` | `/api/auth/me` | Retrieve profile of currently authenticated user | **Yes** | `200`, `401` |

### Reading Management Routes
| Method | Route | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/readings` | Create a new glucose reading | **Yes** | `201`, `400`, `401` |
| `GET` | `/api/readings` | List readings (optional `?date=YYYY-MM-DD` filter) | **Yes** | `200`, `401` |
| `GET` | `/api/readings/:id` | Fetch specific reading by UUID | **Yes** | `200`, `400`, `401`, `404` |
| `PUT` | `/api/readings/:id` | Update existing reading by UUID | **Yes** | `200`, `400`, `401`, `404` |
| `DELETE` | `/api/readings/:id` | Delete reading by UUID | **Yes** | `200`, `400`, `401`, `404` |

### Reporting Routes
| Method | Route | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/reports/daily?date=YYYY-MM-DD` | Single-date aggregates & ordered mealtime readings | **Yes** | `200`, `400`, `401` |
| `GET` | `/api/reports/month-to-date?date=YYYY-MM-DD` | Aggregates from 1st of month through selected date | **Yes** | `200`, `400`, `401` |
| `GET` | `/api/reports/monthly?date=YYYY-MM-DD` | Full statistics for the previous calendar month | **Yes** | `200`, `400`, `401` |

---

## 14. Reporting Functionality

The reporting engine provides mathematical aggregations with rigorous boundary handling:

### 1. Daily Report (`/api/reports/daily?date=YYYY-MM-DD`)
- Computes:
  - **Highest reading** (`MAX(glucose_value)`)
  - **Lowest reading** (`MIN(glucose_value)`)
  - **Average reading** (`ROUND(AVG(glucose_value)::numeric, 1)`)
  - **Total reading count** (`COUNT(*)`)
- Returns the list of readings sorted in clinical mealtime order:
  `morning` $\rightarrow$ `after_breakfast` $\rightarrow$ `after_lunch` $\rightarrow$ `after_dinner`.

### 2. Month-to-Date Report (`/api/reports/month-to-date?date=YYYY-MM-DD`)
- Aggregates all readings recorded between `YYYY-MM-01` and the selected date inclusive.
- Displays daily average trend visualization via Recharts.

### 3. Monthly Report (`/api/reports/monthly?date=YYYY-MM-DD`)
- Determines the full calendar boundaries of the **previous month**:
  - Example: For date `2026-11-15`, computes range `2026-10-01` to `2026-10-31`.
  - Year Rollover: For date `2026-01-15`, rolls back to December of the previous year (`2025-12-01` to `2025-12-31`).
  - Leap-Year Precision: For date `2024-03-10`, accurately calculates `2024-02-01` to `2024-02-29` (29 days in leap years vs 28 in non-leap years).

### 4. Empty-State Handling
When no readings exist in the requested timeframe, the reports return:
```json
{
  "totalReadings": 0,
  "averageGlucose": null,
  "highestGlucose": null,
  "lowestGlucose": null,
  "readings": []
}
```
This guarantees no deceptive zeros skew clinical interpretations.

---

## 15. Project Folder Structure

```
sweety-glucose-tracker/
├── package.json                      # Root workspace scripts & orchestrations
├── .gitignore                        # Global ignore (node_modules, .env, dist)
├── .env.example                      # Root environment configuration template
├── README.md                         # Comprehensive project documentation
│
├── client/                           # Frontend React Application
│   ├── package.json                  # Client dependencies & scripts (Vite, React, Vitest)
│   ├── vite.config.js                # Vite build config, dev proxy, vendor manual chunks
│   ├── tailwind.config.js            # Tailwind theme, colors, typography, soft shadows
│   ├── postcss.config.js             # PostCSS Tailwind & Autoprefixer configuration
│   ├── index.html                    # Single Page Application HTML root
│   ├── .env.example                  # Client environment template (VITE_API_URL)
│   │
│   └── src/
│       ├── main.jsx                  # React application entry point
│       ├── App.jsx                   # Root router, AuthProvider consumer, code-split lazy imports
│       ├── index.css                 # Base Tailwind directives & custom scrollbars
│       │
│       ├── context/
│       │   └── AuthContext.jsx       # Global authentication provider (user, login, register, logout)
│       │
│       ├── services/
│       │   └── api.js                # Centralized ApiClient (dual-mode: HttpOnly cookie + Bearer token)
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   └── Navbar.jsx        # Navigation bar with responsive tab switcher & logout
│       │   ├── modals/
│       │   │   ├── ReadingFormModal.jsx   # Add/Edit reading modal enforcing Rules 1-5
│       │   │   └── DeleteConfirmModal.jsx # Confirmation dialog for safe deletion
│       │   └── ui/
│       │       └── StatCard.jsx      # Reusable KPI metric card with clinical status badges
│       │
│       ├── pages/
│       │   ├── LandingPage.jsx       # Public SaaS landing page (Hero, Features, FAQ, Preview)
│       │   ├── LoginPage.jsx         # Login screen with ⚡ 1-Click Demo login
│       │   ├── RegisterPage.jsx      # Registration screen with password validation
│       │   ├── DashboardPage.jsx     # Patient dashboard (stats, mealtime cards, trend chart)
│       │   ├── ReadingsPage.jsx      # Historical reading timeline & date filters
│       │   └── ReportsPage.jsx       # Daily, Month-to-date, and Monthly report viewer
│       │
│       ├── utils/
│       │   └── constants.js          # Mealtime slot metadata, labels, and boundary constants
│       │
│       └── test/                     # Frontend Unit & Integration Tests (Vitest + RTL)
│           ├── setup.js              # Test setup & @testing-library/jest-dom matchers
│           ├── AuthPages.test.jsx    # Authentication & 1-click Demo button tests
│           ├── LandingPage.test.jsx  # Landing page rendering & CTA callback tests
│           └── ReadingFormModal.test.jsx # Modal validation rules tests
│
└── server/                           # Backend Express API & Database
    ├── package.json                  # Server dependencies (Express, pg, bcrypt, jwt, Jest)
    ├── .env.example                  # Server environment configuration template
    │
    ├── database/
    │   ├── migrate.js                # Migration runner reading SQL files with tracking
    │   ├── migrations/
    │   │   ├── 001_create_users_and_readings.sql # Initial schema, constraints, indexes
    │   │   └── 001_down.sql          # Reversible migration rollback script
    │   └── seeds/
    │       └── seed.js               # Idempotent demo account & clinical sample data seeder
    │
    └── src/
        ├── server.js                 # HTTP listener & database connection verification
        ├── app.js                    # Express app initialization, Helmet, CORS, RateLimiter
        │
        ├── config/
        │   ├── env.js                # Environment variable parser & validation
        │   └── db.js                 # PostgreSQL Pool connection & query helper
        │
        ├── controllers/
        │   ├── authController.js     # Register, login, logout, me handlers
        │   ├── readingController.js  # CRUD handlers with UUID validation
        │   └── reportController.js   # Daily, Month-to-Date, Monthly report handlers
        │
        ├── services/
        │   ├── authService.js        # User creation, password hashing, JWT issuance
        │   ├── readingService.js     # Transactional CRUD & advisory locks
        │   └── reportService.js      # Statistical calculations & date boundary algorithms
        │
        ├── middleware/
        │   ├── authMiddleware.js     # JWT extraction (cookie & Bearer) & verification
        │   └── errorHandler.js       # Centralized error handler with standard JSON errors
        │
        ├── validators/
        │   ├── authValidator.js      # Auth request validation
        │   └── readingValidator.js   # Reading request validation (Rules 1 - 5)
        │
        └── utils/
            ├── constants.js          # Shared error codes, meal slots, numeric boundaries
            ├── errors.js             # Custom ApiError class with HTTP status codes
            ├── dateUtils.js          # Calendar math, leap-year calculations, date formatting
            └── generateSecret.js     # Cryptographic JWT secret generator utility
```

---

## 16. Installation & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (`v20+` recommended)
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: `14` or higher installed and running locally

### Step 1: Clone the Repository
```bash
git clone https://github.com/pallu6753/sweety-glucose-tracker.git
cd sweety-glucose-tracker
```

### Step 2: Install Dependencies
Install dependencies across all workspaces with a single command from the root directory:
```bash
npm install
```

---

## 17. PostgreSQL Database Configuration

### Step 1: Start PostgreSQL
Ensure PostgreSQL is active on your machine. On Windows:
```powershell
Get-Service postgresql*
```

### Step 2: Create Database User and Database
Connect to your local PostgreSQL instance via `psql`:
```sql
-- Connect to postgres as superuser
CREATE USER sweety_app WITH PASSWORD 'your_secure_password';

-- Create development and test databases
CREATE DATABASE sweety_glucose_tracker OWNER sweety_app;
CREATE DATABASE sweety_glucose_tracker_test OWNER sweety_app;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE sweety_glucose_tracker TO sweety_app;
GRANT ALL PRIVILEGES ON DATABASE sweety_glucose_tracker_test TO sweety_app;
```

---

## 18. Database Migrations

Sweety includes an automated, idempotent migration runner (`server/database/migrate.js`). It reads sequential SQL migration files, creates a tracking table `schema_migrations`, and applies each migration in a dedicated transaction.

Run migrations from the root directory:
```bash
npm run migrate
```

Output:
```
[MIGRATION] Connecting to PostgreSQL database...
[MIGRATION] Applying migration: 001_create_users_and_readings.sql...
[MIGRATION] Successfully applied: 001_create_users_and_readings.sql
[MIGRATION] All database migrations are up to date.
```

---

## 19. Seed Script & Demo Account Instructions

To populate the database with the official Demo Account and a full spectrum of clinical sample readings across three calendar months (Today, Month-to-date, and Previous Month):

```bash
npm run seed
```

### Demo Account Credentials
- **Email**: `demo@sweety.com`
- **Password**: `SweetyDemo2026!`
- **Patient Name**: Demo Patient

> [!NOTE]
> The seed script is completely **idempotent**. It checks for the existence of `demo@sweety.com` before inserting and uses `ON CONFLICT (user_id, reading_date, time_slot) DO UPDATE` for readings. It never deletes or alters user accounts.

### Starting Local Development
Run both the Express backend API (`http://localhost:5000`) and the Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

---

## 20. Environment Variables

### Backend Server (`server/.env`)
Create a file at `server/.env` based on `server/.env.example`:
```env
# Server Runtime
NODE_ENV=development
PORT=5000

# PostgreSQL Database Connection Strings
DATABASE_URL=postgresql://sweety_app:your_secure_password@localhost:5432/sweety_glucose_tracker
TEST_DATABASE_URL=postgresql://sweety_app:your_secure_password@localhost:5432/sweety_glucose_tracker_test

# Authentication & Session Security
JWT_SECRET=super_secret_jwt_key_min_32_characters_random_string
JWT_EXPIRES_IN=7d

# CORS Allowed Client Origin
CLIENT_URL=http://localhost:5173
```

### Frontend Client (`client/.env`)
Create a file at `client/.env` based on `client/.env.example`:
```env
# Base URL for Express API (Vite dev proxy forwards /api to http://localhost:5000 if blank)
VITE_API_URL=http://localhost:5000
```

---

## 21. Testing Instructions

Sweety features a comprehensive automated testing suite encompassing unit tests, boundary tests, API contract tests, PostgreSQL live integration tests, and frontend DOM tests.

### Run All Tests (Full Suite)
```bash
npm test
```

### Run Server Tests Only (Jest + Supertest)
```bash
npm run test:server
```

### Run Client Tests Only (Vitest + React Testing Library)
```bash
npm run test:client
```

---

## 22. Actual Test Results

All **41 automated tests** are passing with 100% pass rate:

```
======================================================================
SWEETY AUTOMATED TEST SUITE EXECUTION REPORT
======================================================================

BACKEND TEST SUITE (Jest + Supertest)
  PASS  tests/integration.test.js
    Live PostgreSQL Integration Test Suite
      ✓ Database connection prerequisite check
      User Authentication & Password Hashing
        ✓ registers new user and persists bcrypt password hash in PostgreSQL
        ✓ authenticates user and provides HttpOnly cookie
      Reading CRUD & Integrity Validation
        ✓ creates a valid blood glucose reading
        ✓ Rule 3: rejects duplicate slot for the same date
        ✓ Rule 4: rejects fifth reading on the same date
        ✓ retrieves daily report with logical mealtime slot order and stats
      User Data Isolation
        ✓ ensures user A cannot see or access user B data
  PASS  tests/api.test.js
    API Route Contract Tests
      ✓ GET /api/health responds with status structure
      ✓ Protected endpoint GET /api/readings returns 401 when unauthenticated
      ✓ Protected endpoint GET /api/reports/daily returns 401 when unauthenticated
      ✓ POST /api/auth/register validates required fields
      ✓ POST /api/auth/register validates weak password (< 8 chars or missing numbers)
      ✓ POST /api/auth/login validates empty credentials
      ✓ POST /api/auth/logout clears token cookie
  PASS  tests/authMiddleware.test.js
    Authentication Middleware Tests
      ✓ rejects request without token (401)
      ✓ rejects request with invalid token signature (401)
      ✓ rejects expired token (401)
      ✓ authenticates valid token from HttpOnly cookie and populates req.user
  PASS  tests/dateUtils.test.js
    Date Utilities & Calendar Boundary Tests
      ✓ validates valid date format YYYY-MM-DD
      ✓ checks future date correctly
      ✓ calculates Month-to-Date range inclusive of selected date
      ✓ calculates Previous Full Month range for standard month
      ✓ handles January year rollover to previous year December
      ✓ handles leap year February in previous month calculation
  PASS  tests/validator.test.js
    Reading Validation Rules (Rules 1 - 5)
      ✓ passes for valid reading input
      ✓ Rule 1: rejects missing, null, or empty glucose value
      ✓ Rule 2: rejects values outside [40, 600] and non-integers
      ✓ Rule 2: accepts exact lower bound (40) and upper bound (600)
      ✓ Rule 5: rejects future dates
      ✓ rejects invalid time slots

  Test Suites: 5 passed, 5 total
  Tests:       31 passed, 31 total
  Time:        3.03 s

FRONTEND TEST SUITE (Vitest + React Testing Library)
  PASS  src/test/ReadingFormModal.test.jsx
    Frontend Reading Form Validation Tests
      ✓ validates Rule 1: Value required
      ✓ validates Rule 2: Whole number between 40 and 600
      ✓ handles slot collision warnings
  PASS  src/test/LandingPage.test.jsx
    Public Landing Page Component Tests
      ✓ renders brand heading and core tagline
      ✓ triggers navigation callbacks on CTA clicks
      ✓ renders features, how it works, and FAQ accordion
  PASS  src/test/AuthPages.test.jsx
    Authentication Pages Validation & Accessibility Tests
      ✓ validates password matching on RegisterPage
      ✓ validates weak password without numbers on RegisterPage
      ✓ triggers 1-click Demo Account login on LoginPage
      ✓ displays error message when Demo Account login fails

  Test Files:  3 passed, 3 total
  Tests:       10 passed, 10 total
  Time:        4.13 s

----------------------------------------------------------------------
TOTAL AUTOMATED TESTS: 41 PASSED / 41 TOTAL (100% PASS RATE)
CLIENT PRODUCTION BUILD: BUILT IN 9.52s (0 ERRORS, 0 WARNINGS)
======================================================================
```

---

## 23. Deployment Information

Sweety is deployed on **Render** using a three-tier cloud topology:

```
┌───────────────────────────────────────┐
│     Render Static Site (Frontend)     │
│ https://sweety-glucose-frontend.      │
│ onrender.com                          │
└──────────────────┬────────────────────┘
                   │ HTTPS API Requests (Rewrite /api/*)
                   ▼
┌───────────────────────────────────────┐
│      Render Web Service (Backend)     │
│ https://sweety-glucose-api-9w7c.      │
│ onrender.com                          │
└──────────────────┬────────────────────┘
                   │ SSL Parameterized Connection
                   ▼
┌───────────────────────────────────────┐
│       Render Managed PostgreSQL       │
│ Database: sweety_db_ygmw              │
└───────────────────────────────────────┘
```

### Production Configuration Details

1. **Frontend (Static Site)**:
   - **Repository Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **SPA Routing**: Handled via Render static rewrite rules.

2. **Backend (Web Service)**:
   - **Repository Branch**: `main`
   - **Root Directory**: `server`
   - **Environment**: Node.js (v20+)
   - **Build Command**: `npm install`
   - **Start Command**: `node database/migrate.js && node src/server.js`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `DATABASE_URL=postgresql://...` (Render internal database URL with SSL)
     - `JWT_SECRET=...` (High-entropy 256-bit cryptographically secure secret)
     - `CLIENT_URL=https://sweety-glucose-frontend.onrender.com`

3. **Managed PostgreSQL**:
   - PostgreSQL 16 hosted on Render with SSL mode enabled.
   - Migrations automatically execute before the Express HTTP listener begins accepting traffic.

---

## 24. Assumptions & Limitations

### Assumptions
1. **Measurement Units**: All glucose readings are expressed in **mg/dL** (milligrams per deciliter), standard for American Diabetes Association (ADA) guidelines.
2. **Date Boundaries**: All dates are formatted as ISO calendar strings (`YYYY-MM-DD`). Calendar math respects local time boundaries to avoid timezone date shifts.
3. **Four Daily Slots**: The application standardizes on four discrete mealtime slots (`morning`, `after_breakfast`, `after_lunch`, `after_dinner`) as defined by the assignment rubric.

### Limitations
1. **Third-Party Email Delivery**: Automated password reset emails require an external SMTP provider (e.g. SendGrid, Resend, or AWS SES). The password recovery UI includes a transparent notice guiding evaluators to use their credentials or the 1-click Demo Account.
2. **Third-Party OAuth Credentials**: Google OAuth 2.0 integration code is structured, but requires live `GOOGLE_CLIENT_ID` credentials registered in the Google Cloud Console.

---

## 25. Future Improvements

With additional development time, the following features would expand Sweety into a clinical health platform:

1. **Continuous Glucose Monitor (CGM) Sync**: Direct integrations via Apple HealthKit and Google Health Connect APIs.
2. **HbA1c Estimation**: Automated rolling 90-day estimated Glycated Hemoglobin (eA1c) projections based on historical averages.
3. **Clinical PDF & CSV Export**: Patient-ready PDF reports formatted for clinical review during endocrinologist consultations.
4. **AI-Powered Pattern Recognition**: Machine learning models identifying post-meal glucose spikes and correlating them with meal annotations.
5. **Multi-Unit Toggle**: User setting to switch between mg/dL and mmol/L (international standard).

---

## 26. Author & Project Credits

- **Author**: **Pallavi**
- **GitHub**: [@pallu6753](https://github.com/pallu6753)
- **Project Repository**: [pallu6753/sweety-glucose-tracker](https://github.com/pallu6753/sweety-glucose-tracker)
- **Live Application**: [sweety-glucose-frontend.onrender.com](https://sweety-glucose-frontend.onrender.com/)
- **Target Company**: **Kenpath**
- **Evaluation Position**: **Junior Full Stack Developer – JavaScript & AI**

*Crafted with precision, clinical empathy, and full-stack engineering standards.*
