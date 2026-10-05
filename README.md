# Math Trainer

React + TypeScript, Spring Boot + PostgreSQL. The project is being refactored
into a graph learning platform with personal and shared boards.

Current milestone: `security-contracts`, the first change from
`math-trainer-review-and-refactoring-plan.md` (4 October 2026).
Baseline: `c0f0edb8904f2f4690c1cb052e87d8257b432ed2`.

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

This milestone is **not production-ready**. The legacy runtime configuration
still uses `ddl-auto=create` / seed-on-start and embedded demo credentials.
Do not start it against existing data. This change was tested without a database;
no production database, deployment or backup was inspected or modified.
CSRF integration, session rotation, supported dependency upgrades and
server-verified exercise submissions are still pending.
The current frontend API URL also needs alignment with the runtime before deployment.

Next: `safe-startup` — environment configuration, explicit demo profile,
Flyway migrations and restart/backup tests. See
[continuation](docs/continuation.md) and [implementation log](docs/implementation-log.md).
