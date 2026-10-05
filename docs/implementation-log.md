# Implementation log

## 2026-10-05 — security-contracts

Baseline: `c0f0edb8904f2f4690c1cb052e87d8257b432ed2`; it matches the review plan.
Working branch: `refactor/security-contracts`. No AGENTS.md was present.

Completed:

- Split account creation, editing and responses into RegisterRequest,
  UserUpdateRequest and UserResponse. Removed the all-purpose UserDTO and
  inbound account entity mapper. The server always assigns USER on creation.
- Updates load the path-selected account and retain its password, role and saves.
- Removed password/hash fields from account responses; protected entity
  serialization and Lombok logging as a second boundary.
- Restricted account administration, generic progress CRUD and content mutations
  to ADMIN. Authenticated users retain lesson reads and their own progress flow;
  unlisted routes are denied. Logout has one POST-only filter handler.
- Progress request contracts exclude client-owned user/record IDs and dates.
  New DTOs are constructed with the session user's ID and no client record ID.
  This also avoids the existing creation/upsert mapper overwriting a foreign row
  when given a malicious completion ID.
- Removed completion entity collections from lesson DTOs and ignored the entity
  collection on inbound content mapping. Removed the Data REST starter and its
  exception dependency.
- Added Bean Validation and sanitized validation/JSON/conflict responses that
  do not echo rejected credentials.
- Frontend registration/progress/account types match the API. AuthService purges
  the old localStorage account cache and uses the current server response.
  UserService now calls `/users` instead of the nonexistent `/user`.
- Added HTTP/security and service/mapper regression tests, executable auth/routing
  frontend checks and a GitHub Actions workflow.

Actual local verification (Java 17.0.20, Node 24.19.0):

| Check | Result |
|---|---|
| Backend Maven compile | Passed |
| Backend Maven test | 92 tests passed; no failures/errors/skips |
| Frontend npm ci (locked deps, no install scripts/audit) | Passed |
| `npx tsc --noEmit` | Passed |
| `CI=true npm test -- --watch=false --runInBand` | 7 tests / 2 suites passed |
| `npm run build` | Passed with existing CRA/UI warnings |
| `git diff --check` | Passed |

Maven Wrapper initially failed because Java did not use the workspace network
proxy. The same Maven 3.9.6 distribution was downloaded and configured locally
outside the repository, then the project compiled and tested. The final test
run used cached dependencies offline. Mockito's default self-attaching mock maker
was unavailable in this environment; the committed subclass mock maker made the
full suite executable. Initial frontend failures exposed CRA/Jest's Axios ESM
resolution and a stale template assertion; both were corrected.

Scope and remaining work:

- No runtime database, container or deployment was started. No live data/backup
  inventory has been verified. Stage 0 is only partially complete.
- Current schema initialization is destructive. Flyway, explicit profiles,
  environment secrets and restart/restore verification are the next milestone.
- CSRF is still disabled and login still needs SessionAuthenticationStrategy /
  proper session persistence and rotation integration. Do not call this a full
  auth hardening milestone.
- Client completion statuses remain unverified; server-side exercise validation
  is in the learning-cycle work. This PR limits whose progress can be modified.
- Graph algorithms, D3 rendering, redesign and collaboration are unchanged.
- No dependency upgrade was performed; existing audit findings remain pending.
- CI configuration is committed; remote execution results must be checked on PR.

The implementation commit is the commit containing this entry. Further work
must append the next dated entry, rather than overwrite these results.

## 2026-10-05 — safe-startup (verification in progress)

Parent: `950bbec7fd3ed6c88340e9065571ff0032ff1ea1` (`security-contracts`, PR #1).
Branch: `refactor/safe-startup`. PR #1's remote Checks workflow completed successfully.

Implemented:

- Flyway V1 matches the current legacy JPA schema; V2 adds the seed history table.
  Default startup migrates then validates, never recreates schema. Automatic SQL
  init, automatic baseline and Flyway clean are disabled.
- Existing unmanaged databases fail startup; explicit baseline is an operator-only
  adoption step after backup/restore and schema review. No live target was accessed.
- Datasource/session/origin settings come from environment inputs. Removed bundled
  TLS keystore and embedded datasource secrets; direct TLS uses a mounted keystore.
- Demo content is preserved in a separate resource. The demo profile requires a
  supplied admin password, refuses populated databases, serializes seed with a
  transaction lock and records success atomically. Later starts skip the seed;
  normal startup refuses a database marked demo. Old fixed account hashes removed.
- Browser API calls now use `/api`; CRA's dev proxy and Nginx route it to backend.
- Root Compose provides PostgreSQL 16, multi-stage images, health checks, internal
  DB/backend ports and a loopback frontend bind. Removed conflicting old runtime
  entry points. Added ignored secret files, env example and database runbook.
- Six real PostgreSQL integration scenarios cover fresh install/restart, explicit
  baseline, checksum refusal, demo safety/idempotence and independent dump/restore.
- CI provisions isolated PostgreSQL and builds/starts the Docker stack to test HTTP
  sessions, role restrictions, app/DB restarts and backup restore.

Local checks: 92 backend tests passed; 7 frontend tests passed; TypeScript and
frontend build passed (existing CRA/UI warnings). Integration sources compile.
Compose/CI YAML and shell syntax parsed successfully. Native PostgreSQL/Docker
runtime is unavailable in this execution environment: only UID 0 is mapped and
PostgreSQL requires a non-root user. Real database/container results are delegated
to the committed CI fixtures and are not claimed passed until the run completes.

No live data, deployment or live backup was inspected or modified. Existing
password/key copies require operator rotation if they were deployed. CSRF/session
hardening, dependency upgrades, graph correctness and full production readiness
remain pending. The next entry will record actual remote verification results.
