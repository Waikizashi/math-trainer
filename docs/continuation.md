# Continuation

Repository: https://github.com/Waikizashi/math-trainer

Current branch: `refactor/safe-startup`, stacked on `refactor/security-contracts`
(commit `950bbec7fd3ed6c88340e9065571ff0032ff1ea1`, PR #1). The original review
baseline is `c0f0edb8904f2f4690c1cb052e87d8257b432ed2`.

Read README, docs/implementation-log.md, docs/database-runbook.md and the
4 October 2026 `math-trainer-review-and-refactoring-plan.md`. Keep React /
Spring Boot / PostgreSQL. Read any new AGENTS.md before edits.

## Current work

Security contracts are complete and passed local + remote CI. Safe startup is
implemented: Flyway V1/V2, validate-only Hibernate, env inputs, explicit demo seed,
same-origin API and a root Compose stack. Local unit/MVC checks and frontend checks
passed. Real PostgreSQL / Docker results must be inspected in the CI run and logged.
No live database or production deployment has been accessed.

If this session ends before CI completes, inspect the safe-startup branch's Checks
runs. Fix any persistence/demo/Compose failures on that branch, rerun the affected
checks and append actual results to implementation-log. Do not silently skip the
postgres-it suite, substitute an in-memory DB, or mark runtime checks passed based
on compilation. CI uses random fixtures and a separate restore database.

## Next small change

After safe-startup verification, implement CSRF and session hardening together with
frontend integration: supported SessionAuthenticationStrategy and SecurityContext
persistence, session ID rotation on login, token acquisition/renewal and handling
logout/login cycles. Add real HTTP tests for fixation, missing/wrong CSRF tokens,
allowed origins, session invalidation and fresh login after expiry. Keep ordinary
API authorization and DTO invariants from PR #1. Do not permit broad API exceptions
just to make the UI work.

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
