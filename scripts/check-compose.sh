#!/usr/bin/env bash
set -euo pipefail

# This script deletes its own fixture volume. Refuse all ordinary volume names.
[[ "${CI:-}" == "true" ]] || { echo 'Run this check only with an isolated CI fixture'; exit 1; }
[[ "${DATABASE_VOLUME_NAME:-}" == math-trainer-ci-* ]] || { echo 'Set a unique math-trainer-ci-* test volume'; exit 1; }
project="math-trainer-ci-${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}"
docker volume inspect "$DATABASE_VOLUME_NAME" >/dev/null 2>&1 && { echo 'Test volume already exists; refusing to reuse it'; exit 1; }
temporary=$(mktemp -d)
compose=(docker compose --project-name "$project")
cleanup() {
    result=$?
    if [[ "$result" != 0 ]]; then "${compose[@]}" logs --no-color --tail=100 app frontend || true; fi
    "${compose[@]}" down --volumes --remove-orphans || true
    rm -rf "$temporary"
    exit "$result"
}
trap cleanup EXIT

"${compose[@]}" config --quiet
"${compose[@]}" up --build --detach --wait --wait-timeout 240
origin="http://127.0.0.1:${HTTP_PORT:-8080}"
curl --fail --silent "$origin/api/management/health" > "$temporary/health.json"
curl --fail --silent "$origin/" > "$temporary/index.html"
csrf() {
    curl --fail --silent -b "$temporary/cookies" -c "$temporary/cookies" "$origin/api/csrf" > "$temporary/csrf.json"
    token=$(python3 - "$temporary/csrf.json" <<'PY'
import json,sys
data=json.load(open(sys.argv[1]))
assert data['headerName']=='X-CSRF-TOKEN' and data['token']
print(data['token'])
PY
)
}
session_id() {
    python3 - "$temporary/cookies" <<'PY'
import sys
for line in open(sys.argv[1]):
    line=line.removeprefix('#HttpOnly_')
    if not line.startswith('#'):
        fields=line.strip().split('\t')
        if len(fields)==7 and fields[5]=='JSESSIONID':
            print(fields[6])
            break
PY
}
code=$(curl --silent --output /dev/null --write-out '%{http_code}' -H 'Content-Type: application/json' \
    --data '{}' "$origin/api/register")
[[ "$code" == 403 ]]
csrf
curl --fail --silent -b "$temporary/cookies" -c "$temporary/cookies" \
    -H "X-CSRF-TOKEN: $token" -H 'Content-Type: application/json' --data \
    '{"username":"ci-user","email":"ci-user@example.invalid","password":"ci-test-password","role":"ADMIN","id":999}' \
    "$origin/api/register" > "$temporary/user.json"
python3 - "$temporary/user.json" <<'PY'
import json,sys
user=json.load(open(sys.argv[1]))
assert user['role']=='USER' and user['id']!=999
assert 'password' not in user
PY
login() {
    csrf
    before=$(session_id)
    old_token=$token
    curl --fail --silent -b "$temporary/cookies" -c "$temporary/cookies" \
        -H "X-CSRF-TOKEN: $token" -H 'Content-Type: application/json' \
        --data '{"username":"ci-user","password":"ci-test-password"}' \
        "$origin/api/login" > "$temporary/login.json"
    [[ "$(session_id)" != "$before" ]]
    old_cookie_code=$(curl --silent --output /dev/null --write-out '%{http_code}' \
        -H "Cookie: JSESSIONID=$before" "$origin/api/current/user")
    [[ "$old_cookie_code" == 401 ]]
    stale_code=$(curl --silent --output /dev/null --write-out '%{http_code}' -b "$temporary/cookies" \
        -H "X-CSRF-TOKEN: $old_token" --request POST "$origin/api/logout")
    [[ "$stale_code" == 403 ]]
    curl --fail --silent -b "$temporary/cookies" "$origin/api/current/user" > "$temporary/current.json"
    python3 - "$temporary/user.json" "$temporary/current.json" <<'PY'
import json,sys
assert json.load(open(sys.argv[1])) == json.load(open(sys.argv[2]))
PY
}
login
code=$(curl --silent --output /dev/null --write-out '%{http_code}' -b "$temporary/cookies" "$origin/api/users")
[[ "$code" == 403 ]]
theory_id=$("${compose[@]}" exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "INSERT INTO theories(title) VALUES ('"'"'CI persistent lesson'"'"') RETURNING id"')
csrf
curl --fail --silent -b "$temporary/cookies" -H "X-CSRF-TOKEN: $token" \
    -H 'Content-Type: application/json' --request PUT \
    --data "{\"theoryId\":$theory_id,\"theoryStatus\":\"IN_PROGRESS\",\"userId\":999,\"id\":999}" \
    "$origin/api/user-profile/theory-completions" > "$temporary/progress.json"
python3 - "$temporary/user.json" "$temporary/progress.json" <<'PY'
import json,sys
user=json.load(open(sys.argv[1])); progress=json.load(open(sys.argv[2]))
assert progress['userId']==user['id'] and progress['id']!=999
PY
"${compose[@]}" exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' > "$temporary/backup.dump"

# First restart application, then database + application; registered data survives both.
"${compose[@]}" restart app
"${compose[@]}" up --detach --wait --wait-timeout 180
login
"${compose[@]}" stop app
"${compose[@]}" restart db
"${compose[@]}" up --detach --wait --wait-timeout 180
login

# Restore to a different disposable database; never overwrite the source database.
"${compose[@]}" exec -T db sh -c 'createdb -U "$POSTGRES_USER" math_trainer_restore'
"${compose[@]}" exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d math_trainer_restore --exit-on-error' < "$temporary/backup.dump"
restored=$("${compose[@]}" exec -T db sh -c 'psql -U "$POSTGRES_USER" -d math_trainer_restore -tAc "SELECT username FROM users ORDER BY id"')
[[ "$restored" == ci-user ]]
history=$("${compose[@]}" exec -T db sh -c 'psql -U "$POSTGRES_USER" -d math_trainer_restore -tAc "SELECT count(*) FROM flyway_schema_history WHERE success"')
[[ "$history" == 2 ]]
restored_lesson=$("${compose[@]}" exec -T db sh -c 'psql -U "$POSTGRES_USER" -d math_trainer_restore -tAc "SELECT title FROM theories"')
[[ "$restored_lesson" == 'CI persistent lesson' ]]
restored_progress=$("${compose[@]}" exec -T db sh -c 'psql -U "$POSTGRES_USER" -d math_trainer_restore -tAc "SELECT count(*) FROM theory_completions"')
[[ "$restored_progress" == 1 ]]

# A logout destroys the old session; another login must acquire a fresh CSRF token.
csrf
old_session=$(session_id)
curl --fail --silent -b "$temporary/cookies" -c "$temporary/cookies" \
    -H "X-CSRF-TOKEN: $token" --request POST "$origin/api/logout" > "$temporary/logout.json"
code=$(curl --silent --output /dev/null --write-out '%{http_code}' \
    -H "Cookie: JSESSIONID=$old_session" "$origin/api/current/user")
[[ "$code" == 401 ]]
login
echo 'Compose install, CSRF, session rotation/logout, API access, restarts and backup restore passed'
