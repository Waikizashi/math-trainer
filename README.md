# Math Trainer

React + TypeScript, Spring Boot + PostgreSQL. The project is being refactored
into a graph learning platform with personal and shared boards.

Current milestone: `session-csrf`, following `safe-startup` and `security-contracts` from the
4 October 2026 refactoring plan. Baseline:
`c0f0edb8904f2f4690c1cb052e87d8257b432ed2`.

## Launch

Copy `.env.example` to `.env`, set a locally generated database password, then
run `docker compose up --build --detach --wait` from the repository root.
For local HTTP access, set `SESSION_COOKIE_SECURE=false`; keep it true behind HTTPS.
The site opens at `http://localhost:8080`; API and frontend share one origin.
Schema migrations preserve data on restart; a fresh installation contains no
accounts or seeded content. Existing databases require explicit reviewed adoption.
See [database runbook](docs/database-runbook.md) before using an existing volume.

## Development checks

Requirements: Java 17, Node 24 and npm. Maven Wrapper downloads Maven 3.9.6.

```bash
cd backend/MathTrainerApi
bash mvnw -B test
```

```bash
cd frontend
npm ci --ignore-scripts --no-audit --no-fund
npx tsc --noEmit
CI=true npm test -- --watch=false --runInBand
npm run build
```

The backend tests use mocked repositories/services and Spring MVC slices;
they require neither PostgreSQL nor Docker and do not run seed SQL.
Mockito uses its subclass mock maker so tests do not depend on JVM agent
self-attachment. No final-class mocking is supported with that setting.
The frontend auth/routing test isolates the D3 canvas; it does not verify rendering
or mathematical algorithms. Jest resolves the installed Axios CommonJS build.
CI runs the same checks. Existing CRA/UI lint warnings remain visible during build.

## Current API boundary

- `POST /api/register`: `{ username, email, password }`; the server assigns USER.
- `POST /api/login`, `GET /api/current/user`: `{ id, username, email, role }`, with no credentials.
- `POST /api/logout`: handled by the Spring Security logout filter.
- `GET /api/csrf`: session-bound, masked token and header name; usable before login.
  All POST/PUT/PATCH/DELETE requests, including registration/login/logout, require it.
  Login changes the session ID and token; logout invalidates the session and clears its cookie.
- `/api/users/**` and the generic completion CRUD routes require ADMIN.
- Authenticated users can read theories/practices; content mutations require ADMIN.
- Profile progress writes accept only a theory/practice ID and its status.
  User ID, record ID and date come from the server; old extra JSON fields are ignored.
- Account edits use the path ID and accept only username/email. Passwords and roles
  are preserved. Privilege changes and password recovery need separate future APIs.
- Unlisted routes are denied. Spring Data REST has been removed.
- Learning content excludes other users' completion entities.

Passwords at registration require 8–72 characters and at most 72 UTF-8 bytes.
The current browser session is loaded from the server; old `localStorage.user`
values are removed rather than reused.

## Runtime state and next step

Flyway manages the schema; Hibernate validates it; SQL auto-init and Flyway clean /
automatic baseline are disabled. Demo seed is opt-in, transactional and applied
once to a dedicated database. Database credentials and optional TLS keys come from
environment inputs / mounted files. PostgreSQL and backend ports remain internal.

The shared browser API client obtains tokens in memory, clears them after login/logout,
and refreshes/retries once only on an explicit CSRF filter rejection. Protected API
401 responses clear the browser's authenticated state. Authorization failures,
network errors and server failures do not replay mutations. See
[session contract](docs/auth-session-contract.md).

No live database or deployment was accessed. Full production readiness still needs
supported dependency upgrades, account verification/recovery, rate limits, server-verified
exercise submissions, backup operations and the later product/security checks.

Real PostgreSQL verification is opt-in with `-Ppostgres-it verify`; see the runbook
for fixture requirements. CI also builds the Docker stack and checks same-origin
login, restarts and dump/restore. The safe-startup checks passed: 92 backend unit/MVC
tests, 6 real PostgreSQL scenarios, 7 frontend tests, type/build checks and the full
Compose check. Exact tested commits, CI links and limits are in the implementation log.

The session milestone passed local and remote CI: 104 unit/MVC/HTTP backend tests,
6 PostgreSQL scenarios, 18 frontend tests, type/build checks and full Compose
CSRF/session/progress/restart/restore. Exact commits and links are in the log.

Next: graph-contract and algorithm correctness.
See [continuation](docs/continuation.md) and
[implementation log](docs/implementation-log.md).
