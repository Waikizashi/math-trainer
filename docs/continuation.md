# Continuation

Read `README.md`, `docs/implementation-log.md` and the 4 October 2026
`math-trainer-review-and-refactoring-plan.md` before continuing.

Repository: https://github.com/Waikizashi/math-trainer

Branch: `refactor/security-contracts`; baseline:
`c0f0edb8904f2f4690c1cb052e87d8257b432ed2`.
First plan change (`security-contracts`) is implemented and locally verified.
Keep React / Spring Boot / PostgreSQL. Stage 0 is not yet complete.

## Next change: safe-startup

1. Inspect current branch/PR and run the documented checks. Read any new AGENTS.md.
2. Inspect application properties, Docker files/Compose, all JPA entities and seed
   SQL. Do not run the existing backend against a real database: it recreates it.
3. Determine whether there is a live deployment/database before proposing migration
   there. If there is, back it up and verify restoration before changing it.
   A fresh local fixture can be prepared independently without touching live data.
4. Plan Flyway baseline for the existing schema. Make default startup validate
   migrations, not create/update schema. Handle pre-existing databases explicitly;
   do not silently enable baseline-on-migrate or delete volumes.
5. Move datasource/TLS/session/origin configuration to environment inputs. Provide
   examples without secrets. Isolate optional demo data in an explicit dev profile;
   keep production free of seeded demo-admin accounts.
6. Align frontend calls and backend origin/proxy configuration. Prefer a same-origin
   API; remove hard-coded URLs consistently across services and components.
7. Add real persistence integration checks for fresh install, restart, migration
   repeatability and backup/restore. Use isolated test DBs only.
8. Update log/continuation with actual commands and results. Make a separate
   reviewable PR. Do not deploy or merge the current security change automatically.

Follow-up auth work must enable CSRF end-to-end and rotate/persist sessions using
Spring Security's supported session strategy. Scope that independently if needed.
After safe-startup, expand test-baseline, then implement graph-contract and
algorithm-correctness in the order listed in section 16 of the plan.

## Security invariants introduced here

- No public role/ID assignment, no response credential fields.
- Administrative routes are server-protected; new routes start denied.
- Personal progress ownership comes from the session; no inbound completion ID.
- Content JSON never includes users' completion entities.
- An account edit cannot replace password/role through the ordinary request.
- Current user data comes from the server, not localStorage.

Existing tests include 92 backend cases and 7 frontend cases. HTTP tests use the
real filter chain with mocked business services; service tests exercise the real
account service and generated mapper with a mocked repository. These do not prove
database persistence, full browser rendering or production security.
