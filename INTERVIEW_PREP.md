# Sweety – Technical Interview Preparation Guide
## Kenpath Full Stack Developer (JavaScript & AI) Hiring Assignment

This guide contains precise architectural explanations, code citations, and answers to the top 20 technical interview questions directly based on the actual implementation of **Sweety – Blood Glucose Tracker**.

---

### Core Concepts & Implementation Reference

#### 1. React Architecture & Component Design
- **Concept:** Modular, reusable component architecture with unidirectional data flow and clean separation of concerns.
- **Code Reference:** `client/src/App.jsx`, `client/src/pages/`, `client/src/components/common/`, `client/src/components/readings/`.
- **How it works:** Page components (`DashboardPage`, `ReadingsPage`, `ReportsPage`) manage page-level state and orchestrate presentation components (`StatCard`, `SlotCompletionIndicator`, `ReadingFormModal`, `DeleteConfirmModal`). Reusable components receive data via props and communicate user actions via callback handlers.

#### 2. Express Architecture & Layered Modularity
- **Concept:** Layered architecture separating HTTP routing, request validation, business logic, and database persistence.
- **Code Reference:** `server/src/app.js`, `routes/`, `controllers/`, `services/`, `validators/`, `middleware/`.
- **Flow:** `Request` $\rightarrow$ `Helmet/CORS/CookieParser/RateLimit` $\rightarrow$ `Router` $\rightarrow$ `AuthMiddleware` $\rightarrow$ `Validator` $\rightarrow$ `Controller` $\rightarrow$ `Service` $\rightarrow$ `PostgreSQL Pool` $\rightarrow$ `Response`.

#### 3. PostgreSQL Relational Schema
- **Concept:** Normalized two-table schema with strict relational integrity, UUID identifiers, check constraints, and performance indexes.
- **Code Reference:** `server/database/migrations/001_create_users_and_readings.sql`.
- **Key Tables:** `users` (id, name, email, password_hash, created_at, updated_at) and `readings` (id, user_id, reading_date, time_slot, glucose_value, created_at, updated_at).

#### 4. Primary and Foreign Keys
- **Concept:** Relational integrity via cryptographic UUIDs (`gen_random_uuid()`) and cascading deletes.
- **Code Reference:** `server/database/migrations/001_create_users_and_readings.sql` line 21:
  ```sql
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
  ```
- **Why UUIDs:** Unlike auto-incrementing integers, UUIDs prevent sequential enumeration attacks and make multi-environment database merges trivial.

#### 5. Unique Constraints & Database Integrity
- **Concept:** Multi-column uniqueness preventing data duplication at the database engine level.
- **Code Reference:** `server/database/migrations/001_create_users_and_readings.sql` line 30:
  ```sql
  CONSTRAINT uq_user_date_slot UNIQUE (user_id, reading_date, time_slot)
  ```
- **Why it matters:** Even if an application-level check suffered a race condition, the database engine will reject duplicate slots with error code `23505`.

#### 6. bcrypt Cryptographic Password Hashing
- **Concept:** Adaptive one-way hashing with salt generation to prevent rainbow table attacks.
- **Code Reference:** `server/src/services/authService.js` line 18:
  ```javascript
  const passwordHash = await bcrypt.hash(password, 10);
  ```
- **Verification:** `await bcrypt.compare(password, user.password_hash)` securely checks passwords in constant time without ever storing or logging plain text.

#### 7. JSON Web Tokens (JWT)
- **Concept:** Compact, URL-safe cryptographic claims used for stateless authorization.
- **Code Reference:** `server/src/services/authService.js` and `server/src/middleware/auth.js`.
- **Payload:** `{ id: user.id, email: user.email, name: user.name }` signed with HS256 and `config.jwtSecret`. Expired or tampered tokens are rejected with HTTP 401.

#### 8. HttpOnly Cookies & Session Protection
- **Concept:** Storing JWT in an `HttpOnly` cookie rather than `localStorage` to defend against Cross-Site Scripting (XSS) attacks.
- **Code Reference:** `server/src/controllers/authController.js` lines 5–10:
  ```javascript
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  ```
- **Why:** JavaScript running in the browser cannot read or steal an `HttpOnly` cookie via `document.cookie`.

#### 9. RESTful API Design
- **Concept:** Resource-oriented architecture using standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) and consistent semantic status codes (200, 201, 400, 401, 403, 404, 409, 500).
- **Code Reference:** `server/src/routes/readingRoutes.js`, `server/src/controllers/readingController.js`.
- **Response Format:** Uniform JSON envelopes: `{ success: true, data: { ... } }` or `{ success: false, message: "...", code: "..." }`.

#### 10. Express Middleware Chain
- **Concept:** Composable pipeline functions that inspect, modify, or reject requests before hitting route handlers.
- **Code Reference:** `server/src/middleware/auth.js` (session verification) and `server/src/middleware/errorHandler.js` (centralized error catch).

#### 11. SQL Injection Prevention & Parameterized Queries
- **Concept:** Complete separation of SQL code and user data using positional parameter placeholders ($1, $2).
- **Code Reference:** `server/src/config/db.js` and all service queries:
  ```javascript
  await client.query('SELECT * FROM readings WHERE user_id = $1 AND reading_date = $2', [userId, readingDate]);
  ```
- **Why:** User input is sent to the database engine as raw data parameters, completely preventing SQL interpretation or injection.

#### 12. User-Level Data Isolation
- **Concept:** Multi-tenant security where one patient cannot read, alter, or delete another patient's glucose measurements.
- **Code Reference:** `server/src/services/readingService.js`:
  - Every SQL query enforces `WHERE user_id = $1`.
  - The `userId` is obtained exclusively from the verified JWT payload (`req.user.id`), **never** from request body or URL parameters.

#### 13. Database Transactions
- **Concept:** Atomic units of work guaranteeing ACID compliance (`BEGIN`, `COMMIT`, `ROLLBACK`).
- **Code Reference:** `server/src/services/readingService.js` (in `createReading` and `updateReading`).
- **Why:** Ensures that advisory locking, limit checking, duplicate checking, and record insertion succeed together or roll back cleanly if any step fails.

#### 14. PostgreSQL Advisory Locks for Concurrency
- **Concept:** Application-defined distributed locking within PostgreSQL to serialize concurrent requests for the same user and date without table-locking.
- **Code Reference:** `server/src/services/readingService.js` line 34:
  ```sql
  SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2));
  ```
- **Deterministic Ordering:** When editing a reading across dates, `[oldDate, newDate].sort()` ensures locks are always acquired in identical order, eliminating deadlocks.

#### 15. Reading CRUD Operations
- **Concept:** Create, Read (all/filtered/single), Update, and Delete operations.
- **Code Reference:** `server/src/services/readingService.js`.
- **Key Detail:** Updating row locks the existing record with `FOR UPDATE` to verify ownership and avoid write collisions.

#### 16. SQL Aggregation in Reporting Engine
- **Concept:** Pushing heavy calculations to the database engine rather than fetching all rows into Node memory.
- **Code Reference:** `server/src/services/reportService.js` lines 23–32:
  ```sql
  SELECT 
    MAX(glucose_value)::int as highest,
    MIN(glucose_value)::int as lowest,
    ROUND(AVG(glucose_value)::numeric, 1)::float as average,
    COUNT(*)::int as count
  FROM readings
  WHERE user_id = $1 AND reading_date >= $2 AND reading_date <= $3
  ```

#### 17. Date Calculations & Calendar Boundaries
- **Concept:** Strict string-based `YYYY-MM-DD` calendar logic avoiding timezone shifts (e.g. UTC vs local midnight shifts).
- **Code Reference:** `server/src/utils/dateUtils.js`.
- **Edge Cases Handled:**
  - January rollover: January 2026 $\rightarrow$ December 2025 (Dec 1 – Dec 31).
  - Leap year February: 2024 returns 29 days (`2024-02-01` to `2024-02-29`); 2026 returns 28 days (`2026-02-01` to `2026-02-28`).

#### 18. React State Management & Hooks
- **Concept:** Global authentication state managed via React Context (`AuthContext`) and localized screen state managed via `useState` and `useEffect`.
- **Code Reference:** `client/src/context/AuthContext.jsx`, `client/src/pages/DashboardPage.jsx`.

#### 19. Client-Server API Integration
- **Concept:** Centralized `ApiClient` class (`client/src/services/api.js`) configuring base URL, `Content-Type: application/json`, and `credentials: 'include'` for cross-origin cookie sharing.

#### 20. Automated Testing with Jest, Supertest & Vitest
- **Concept:** Multi-layered automated QA strategy:
  - Unit tests for date math & calendar boundaries (`dateUtils.test.js`).
  - Validation rules testing (`validator.test.js`).
  - Auth middleware & token decoding (`authMiddleware.test.js`).
  - API endpoint status & error contracts (`api.test.js`).
  - Live PostgreSQL integration (`integration.test.js`).
  - Frontend component & form validation (`ReadingFormModal.test.jsx`).

---

### Top 20 Kenpath Interview Questions & Answers

**Q1: Why did you choose pure `pg` (node-postgres) instead of an ORM like Prisma, TypeORM, or Sequelize?**  
*Answer:* Pure `pg` provides direct, low-overhead access to PostgreSQL's native capabilities, notably transaction-scoped advisory locks (`pg_advisory_xact_lock`) and database-level SQL aggregation functions. It avoids ORM abstraction overhead, ensures queries are strictly parameterized, and makes SQL behavior 100% predictable.

**Q2: How does the application guarantee that a user cannot record a 5th reading on a given day even under concurrent traffic?**  
*Answer:* In `readingService.js`, the reading creation operation begins a database transaction and immediately requests a transaction-level advisory lock using `pg_advisory_xact_lock(hashtext(userId), hashtext(readingDate))`. Any simultaneous request for the same user and date must wait for this lock. The first request counts existing readings, inserts the 4th, and commits. The waiting request then acquires the lock, sees count = 4, and is rejected with HTTP 400 (`"You can add only 4 readings per day."`).

**Q3: How do you prevent deadlocks when a user updates a reading and changes its date?**  
*Answer:* In `updateReading`, when the destination date differs from the source date, both dates must be locked. To prevent circular wait conditions (deadlocks), the code sorts the two date strings lexicographically: `const [first, second] = [oldDate, newDate].sort()`. Both requests lock dates in the exact same sequence.

**Q4: Why store the JWT in an HttpOnly cookie instead of localStorage?**  
*Answer:* Tokens in `localStorage` can be accessed and exfiltrated by any third-party script via Cross-Site Scripting (XSS). An `HttpOnly` cookie cannot be read by JavaScript in the browser (`document.cookie`), eliminating token theft via script injection.

**Q5: How do you prevent timezone shifts from changing the reading date (e.g., from Nov 13 to Nov 12)?**  
*Answer:* In `dateUtils.js` and `readingService.js`, dates are formatted and parsed strictly as date-only `YYYY-MM-DD` strings. JavaScript `new Date()` timezone conversions are avoided across the wire, ensuring calendar dates match the user's intent.

**Q6: What happens if a duplicate slot is submitted?**  
*Answer:* Validation occurs in two layers:
1. Application layer checks if slot exists and returns HTTP 409 with `"You already have an {Slot label} reading for this date."`
2. Database constraint `CONSTRAINT uq_user_date_slot UNIQUE(user_id, reading_date, time_slot)` provides ultimate engine-level defense against race conditions.

**Q7: How is user data isolation enforced?**  
*Answer:* The client never specifies a `user_id` in requests. The server extracts the authenticated user ID exclusively from the verified JWT payload (`req.user.id`). Every SQL query is parameterized with `user_id = $1`.

**Q8: How does the previous-month report calculate date ranges for January?**  
*Answer:* In `getPreviousMonthRange`, if the current month is `1` (January), the algorithm sets previous month to `12` (December) and decrements the year (`year - 1`), setting the range from `prevYear-12-01` to `prevYear-12-31`.

**Q9: How does the report engine handle leap years?**  
*Answer:* In `getPreviousMonthRange`, leap years are evaluated using the standard rule: `(year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)`. When previous month is February, it returns 29 days in a leap year (e.g. 2024) and 28 days in common years (e.g. 2026).

**Q10: Why do empty reports return null statistics instead of 0?**  
*Answer:* In clinical monitoring, an average blood glucose of `0 mg/dL` represents fatal hypoglycemia, not missing data. Returning `null` for highest, lowest, and average clearly distinguishes between lack of measurements and actual measured values.

**Q11: How do you handle password hashing and security?**  
*Answer:* Using `bcrypt` with 10 salt rounds. The plain-text password is never stored or returned in any API response. Incoming passwords during login are verified using constant-time `bcrypt.compare`.

**Q12: How are database migrations executed?**  
*Answer:* A custom runner `server/database/migrate.js` maintains a `schema_migrations` tracking table in PostgreSQL. It reads sequential SQL files from `server/database/migrations/`, wraps unapplied migrations in transactions, and executes them safely.

**Q13: How is the database seeded?**  
*Answer:* The script `server/database/seeds/seed.js` is idempotent. It creates a demo user (`demo@sweety.com` / `SweetyDemo2026!`) and inserts sample readings across today, the current month, and the full previous month using `ON CONFLICT (user_id, reading_date, time_slot) DO UPDATE`, allowing repeated safe execution.

**Q14: What error structure is used across the API?**  
*Answer:* A standard envelope: `{ success: false, message: "...", code: "...", errors: [] }`. Error codes include `VALIDATION_ERROR`, `DUPLICATE_READING`, `DAILY_LIMIT_REACHED`, `FUTURE_DATE`, `UNAUTHORIZED`, `NOT_FOUND`, and `CONFLICT`.

**Q15: What security headers are implemented?**  
*Answer:* The Express application integrates `helmet` to set secure HTTP headers (Content Security Policy, X-Frame-Options, Strict-Transport-Security), and `cors` with explicit origin whitelist and `credentials: true`.

**Q16: How do you validate glucose values?**  
*Answer:* Rule 2 requires an integer between 40 and 600 mg/dL. The validator checks presence, verifies integer format (rejecting decimals like `120.5`), rejects `NaN`, and enforces $40 \le \text{value} \le 600$.

**Q17: How is the React frontend structured for responsiveness?**  
*Answer:* Built with Tailwind CSS using mobile-first utility classes (`sm:`, `md:`, `lg:`). Tables feature responsive horizontal scrolling wrappers, and cards adapt from single-column on mobile to multi-column grids on desktop.

**Q18: What is the purpose of the 4-slot progress indicator on the dashboard?**  
*Answer:* It visually tracks whether the patient has recorded their 4 daily mealtimes (`Morning`, `After breakfast`, `After lunch`, `After dinner`). Clicking an unrecorded slot opens the Add Modal pre-selected to that slot; clicking a recorded slot opens the Edit Modal.

**Q19: How do automated backend tests work with ESM modules in Node.js?**  
*Answer:* Node.js is executed with `--experimental-vm-modules` to enable native ECMAScript Module support in Jest. Mocks and assertions are imported directly from `@jest/globals`.

**Q20: What are the main production considerations if deploying this to AWS or GCP?**  
*Answer:*
1. Set `NODE_ENV=production` to enable `secure: true` on cookies and suppress stack traces.
2. Use an environment-injected PostgreSQL connection string (e.g. AWS RDS / GCP Cloud SQL).
3. Generate a strong 256-bit random JWT secret using `npm run generate-secret`.
4. Deploy the React build (`dist/`) behind a CDN or Nginx reverse proxy.
