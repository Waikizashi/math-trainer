# Continuation

Repository: https://github.com/Waikizashi/math-trainer

Current branch: `refactor/session-csrf`, stacked on `refactor/safe-startup`
(commit `81a6772158757f34738ddcd24320aef21accb84b`, PR #2), itself stacked on PR #1. The original review
baseline is `c0f0edb8904f2f4690c1cb052e87d8257b432ed2`.

Read README, docs/implementation-log.md, docs/database-runbook.md and the
4 October 2026 `math-trainer-review-and-refactoring-plan.md`. Keep React /
Spring Boot / PostgreSQL. Read any new AGENTS.md before edits.

## Current work

Security contracts are complete and passed local + remote CI. Safe startup is
implemented: Flyway V1/V2, validate-only Hibernate, env inputs, explicit demo seed,
same-origin API and a root Compose stack. Local and remote verification passed,
including real PostgreSQL and Docker. No live database or production deployment
has been accessed.

Safe startup is now verified at `799d996919aa49b82be57f4d3800769108cfe639`:
[PR Checks](https://github.com/Waikizashi/math-trainer/actions/runs/37267881955) and
[branch Checks](https://github.com/Waikizashi/math-trainer/actions/runs/37267878847)
both passed. Results: 92 backend unit/MVC tests, 6 real PostgreSQL tests, 7 frontend
tests, type/build checks and full Compose registration/login/access/restart/restore.
The legacy duplicate HTTP connector was removed and test profiles now activate
before Spring initializes. Details and limits are in implementation-log.
CI uses random fixtures and a separate restore database; do not replace it with
in-memory persistence or silently skip the postgres-it suite.

## Active verification

CSRF/session code is implemented. Local results: 104 backend tests (including three
real HTTP/Tomcat session/CORS scenarios), 18 frontend tests, TypeScript and frontend
build passed. Inspect the session-csrf branch's CI for real PostgreSQL and updated
Compose checks before marking it complete. Fix failures on this branch and append
actual results. See docs/auth-session-contract.md. Do not exempt mutation routes
from CSRF or retry every 403 to make tests/UI work.

## Next small change

After CI passes, create a branch stacked on session-csrf and implement graph-contract:
define GraphDocument and graph/view boundaries, stable UUIDs, numeric/null weights,
runtime validation and legacy adapters. Document graph-kind semantics in an ADR.
Keep the legacy storage available during additive migration; do not edit applied
Flyway V1/V2 or switch the whole editor before adapters and round-trip tests pass.

Then proceed to graph-contract and algorithm-correctness in section 16 of the
review plan; isolate graph data from React/D3 before redesigning the editor.

## Data rules

- Do not edit applied Flyway migrations; append new ones.
- Do not auto-baseline an unknown database or delete a volume to pass startup.
- Existing data needs backup, independent restore, full schema comparison and an
  explicit reviewed baseline. See the runbook. Hibernate validation is not a
  comprehensive schema-equivalence check.
- Demo requires a separate database and a supplied password; normal runtime refuses
  demo-marked data. Never promote a demo volume to production.
- `.env`/keystores/backups are excluded from git and image contexts.
- Do not merge/deploy the stacked PRs automatically; continue on their branches.

Full production readiness is still pending, including dependency upgrades,
server-verified exercise answers, board storage, collaboration and operational
backup/monitoring checks. Preserve the baseline and append results to the log.
