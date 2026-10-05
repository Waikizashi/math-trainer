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

## 2026-10-05 — safe-startup verified

Verified implementation: `799d996919aa49b82be57f4d3800769108cfe639`, PR #2,
stacked on PR #1. Both remote Checks runs completed successfully:

- [Pull request run 37267881955](https://github.com/Waikizashi/math-trainer/actions/runs/37267881955)
- [Branch run 37267878847](https://github.com/Waikizashi/math-trainer/actions/runs/37267878847)

| Check | Actual result |
|---|---|
| Backend unit/MVC tests | 92 passed; no failures/errors/skips |
| Real PostgreSQL 16 integration tests | 6 passed; no failures/errors/skips |
| Frontend tests | 7 passed |
| TypeScript and frontend production build | Passed; existing CRA/UI warnings remain |
| Docker image builds and health checks | Passed |
| Same-origin registration/login/current user | Passed; supplied ADMIN role/id ignored, no password response |
| Administrative API access for ordinary user | 403 as expected |
| Application restart and database/application restart | Passed; registered account and login retained |
| Independent PostgreSQL dump/restore | Passed; account, lesson, migration history and identity generation retained |
| Packaged resources | Flyway migrations present; automatic data.sql and private-key files absent |

The first remote run found a legacy Tomcat customizer opening a second connector
on port 8080. Removed it; the single connector now follows standard server.port /
TLS configuration. It also found that integration tests set active profiles after
Spring had already loaded profile configuration. Tests now activate the demo /
persistence-test profile in SpringApplicationBuilder before initialization.
The corrected database and container checks passed without skipping scenarios.

The PostgreSQL suite also verified explicit baseline without losing legacy rows,
refusal of unknown unmanaged schemas, checksum mismatch and Flyway clean, demo
idempotence/sequence state, refusal to seed populated data, and refusal to run a
demo-marked database under the normal profile. Expected startup failures in these
negative scenarios are intentional assertions, not failed test runs.

This completes the safe-startup code and isolated runtime verification milestone.
No live database, production deployment or operational backup inventory was
accessed. The existing-database rehearsal in the runbook still applies to each
actual target. Next: CSRF/session lifecycle integration, then graph contracts and
algorithm correctness; the other production-readiness items remain open.

## 2026-10-05 — session-csrf (remote verification in progress)

Parent: `81a6772158757f34738ddcd24320aef21accb84b` (`safe-startup`, PR #2).
Branch: `refactor/session-csrf`.

- Enabled session-bound CSRF on every mutation, including login/register/logout.
  Added non-cacheable GET /api/csrf exposing only the masked token and header name.
- JSON login invokes session-ID rotation and CSRF authentication strategies, creates
  a fresh SecurityContext and explicitly saves through the configured repository.
  Logout invalidates the session and expires JSESSIONID. Disabled request caching
  so ordinary unauthenticated reads do not allocate a session.
- Added sanitized csrf_invalid/access_denied/authentication_required errors.
- Centralized frontend requests in a same-origin credentialed Axios client. Token
  state is memory-only, acquisition is deduplicated, login/logout invalidate it,
  and only a confirmed pre-controller CSRF rejection gets one refresh/retry.
  Other 403/401, network and server errors do not replay writes. Protected API
  401 responses clear AuthContext; legacy localStorage account removal remains.
- Added nine MVC cases and three real HTTP/Tomcat tests for login/logout cycles,
  fixation, old tokens/cookies, timeout and CORS. Existing authorization tests now
  supply valid CSRF tokens so they continue checking authorization independently.
- Added eleven frontend API-client tests. Extended Compose verification with CSRF,
  session rotation, logout/new login, protected progress and restored lesson/progress.

Actual local results: 104 backend tests passed with no failures/errors/skips;
18 frontend tests passed; TypeScript and frontend production build passed with
existing UI/CRA warnings. Shell syntax and diff checks passed. PostgreSQL/Compose
runtime checks await CI; do not claim them based on compilation/local mock tests.
No live database, production deployment or operational backup was accessed.
