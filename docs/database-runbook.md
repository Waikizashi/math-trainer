# Database startup, adoption and recovery

Default startup runs Flyway V1/V2, then Hibernate validates the schema.
SQL auto-init is disabled. Flyway clean and automatic baseline are disabled.
An empty database gets schema only: no users, admin passwords or educational seed.
Migration checksums are verified on every startup. Do not edit an applied migration;
add a new numbered migration for subsequent changes.

V1 preserves the legacy JPA table/column contract. V2 adds the demo seed marker.
Graph model changes and board storage require later migrations, not edits to V1.

## Fresh local installation

From the repository root:

```bash
cp .env.example .env
```

Set a locally generated `DATABASE_PASSWORD` in `.env`. For HTTP-only local use set
`SESSION_COOKIE_SECURE=false`. With an HTTPS reverse proxy keep it `true`.
Then:

```bash
docker compose up --build --detach --wait
```

Open `http://localhost:8080`. The frontend proxies `/api` to the backend; neither
PostgreSQL nor the backend publishes a host port. The default frontend bind is
loopback, suitable for local access or a VPS HTTPS reverse proxy.
The health endpoint exposes status only at `/api/management/health`.
New users register as USER; administrative provisioning is a separate future task.

For local source development, export `DATABASE_URL`, `DATABASE_USERNAME` and
`DATABASE_PASSWORD`, run the backend with `dev`, then `npm start` in frontend.
CRA forwards `/api` to `127.0.0.1:8080`. Only the explicit dev profile permits the
local cross-origin browser origin and insecure HTTP session cookie.

## Optional dedicated demo

Use a **new, separately named** database volume, set
`SPRING_PROFILES_ACTIVE=dev,demo`, and provide `DEMO_ADMIN_PASSWORD` in `.env`.
The demo username is `demo-admin`. No default password exists.
Seed refuses populated user/content tables unless its successful seed marker
already exists. Account, content and marker writes share a transaction; concurrent
first starts serialize with a PostgreSQL transaction lock. Restart skips the seed.
Identity sequences are advanced past the legacy content's explicit IDs.

Do not reuse that volume for production. A normal startup refuses a database marked
as demo, rather than silently retaining a demo administrator.

## Existing databases: no automatic adoption

No live deployment/database was accessed while implementing this change.
Before applying it to existing data:

1. Stop writes and identify the exact PostgreSQL database, schema and Docker volume.
   The old Compose location could have created a volume such as
   `docker_postgres_data`. The new default is `math-trainer-postgres-data`.
   Point `DATABASE_VOLUME_NAME` at the intended existing volume only after backup
   and schema verification; a different volume is a different database.
2. Take a custom-format dump and restore it to an independent disposable database.
3. Compare the clone's full schema to `V1__legacy_schema.sql`: tables, types,
   nullability, identity/sequence behavior, unique keys, foreign keys and enum checks.
   Resolve differences with a reviewed additive migration. Hibernate validate alone
   does not check every constraint/index and does not prove equivalence.
4. On the verified clone, supply the `DATABASE_*` environment inputs and explicitly
   baseline version 1 using the matching repository's Maven plugin:

   ```bash
   cd backend/MathTrainerApi
   bash mvnw -B flyway:baseline
   ```

   This records V1 as already represented; it does not execute V1 or erase rows.
   It is deliberately separate from normal application startup. Do not use it on
   an empty database or a schema whose compatibility has not been checked.
5. Start the clone, apply V2, validate retained users/content/progress and identity
   generation, restart twice, and test authentication and reads.
6. Only after that rehearsal, repeat the reviewed steps on the intended live target
   with writes paused and the verified backup available. Back up again before any
   later upgrade. Never use `ddl-auto=create/update`, `flyway:clean`, automatic
   baseline-on-migrate, or volume deletion to make an upgrade pass.

Deletion of the old committed credentials/keystore does not revoke historic copies.
If those values were used outside a local demo, replace them in the deployed system.

## Backup and independent restore

```bash
mkdir -p backups
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' > backups/math-trainer.dump
```

Keep that file protected and persist it outside the server/volume being backed up.
For a rehearsal, use a fresh, isolated PostgreSQL instance/database and compatible
PostgreSQL client tooling; run `pg_restore --exit-on-error` there. Preserve the
schema, sequence state and `flyway_schema_history`. Start the same application
version against the restored copy, check row counts and actual user/content reads,
then insert a new record to verify sequence restoration. Do not restore over the
source database as a test. For a consistent application-level backup, pause writes
or use a checkpoint/maintenance policy appropriate to the deployment.

## Verified integration checks

```bash
cd backend/MathTrainerApi
# A disposable loopback database named math_trainer_test is required.
export POSTGRES_TEST_URL=jdbc:postgresql://127.0.0.1:5432/math_trainer_test
export POSTGRES_TEST_USERNAME=postgres
# Set POSTGRES_TEST_PASSWORD without committing or printing it.
bash mvnw -B -Ppostgres-it verify
```

The integration suite refuses other hosts/database names and fails if inputs are
missing. It creates random schemas and a separate restore database and removes only
those fixtures. It needs `pg_dump` / `pg_restore` on PATH and a test role allowed
to create/drop its test schemas/databases. Default `mvn test` runs the isolated unit
and MVC suites without PostgreSQL. CI provisions PostgreSQL 16 and runs both.

The CI Compose check is for throwaway `math-trainer-ci-*` volumes only. It tests
fresh install, same-origin session login, role restrictions, application/database
restarts and dump/restore. It tears down its own test volume; do not use it for
ordinary runtime management.

Runtime safety is improved, but CSRF/session rotation, supported dependency upgrades,
verified exercise submissions and operational production hardening remain pending.
