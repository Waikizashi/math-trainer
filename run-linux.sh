#!/usr/bin/env bash
set -eu

CURRENT_DIR="$(pwd)"
SCRIPT_DIR="$(dirname "$0")"

cd "${SCRIPT_DIR}/docker"
docker compose up --build

cd "${CURRENT_DIR}"
