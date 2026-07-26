#!/usr/bin/env bash
# Fail fast when the E2E backend API is not running.
#
# Usage: ./scripts/check-e2e-backend.sh
# Skip:  SKIP_E2E_BACKEND_CHECK=1 ./scripts/check-e2e-backend.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.e2e"

if [[ "${SKIP_E2E_BACKEND_CHECK:-}" == "1" ]]; then
  exit 0
fi

read_env_var() {
  local key="$1"

  if [[ ! -f "$ENV_FILE" ]]; then
    return 1
  fi

  local line
  line=$(grep -E "^${key}=" "$ENV_FILE" 2>/dev/null | tail -1 || true)

  if [[ -z "$line" ]]; then
    return 1
  fi

  local value="${line#*=}"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  value="${value#\"}"
  value="${value%\"}"
  value="${value#\'}"
  value="${value%\'}"

  if [[ -n "$value" ]]; then
    printf '%s' "$value"
    return 0
  fi

  return 1
}

API_URL="$(read_env_var E2E_API_URL || read_env_var PUBLIC_API_URL || echo 'http://localhost:8080')"
HEALTH_URL="${API_URL%/}/api/v1/health-check"

if curl -sf --max-time 3 "$HEALTH_URL" > /dev/null 2>&1; then
  exit 0
fi

if [[ -t 2 ]] && [[ -z "${NO_COLOR:-}" ]]; then
  C_RESET=$'\033[0m'
  C_BOLD=$'\033[1m'
  C_DIM=$'\033[2m'
  C_RED=$'\033[31m'
  C_YELLOW=$'\033[33m'
else
  C_RESET=""
  C_BOLD=""
  C_DIM=""
  C_RED=""
  C_YELLOW=""
fi

printf '%b\n' "" >&2
printf '%b\n' "${C_RED}${C_BOLD}⚠️  E2E backend is not reachable${C_RESET}" >&2
printf '%b\n' "${C_RED}   ${API_URL}${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "${C_RED}Start the API first, then run E2E tests again:${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "  ${C_YELLOW}make docker-e2e-up${C_RESET}    ${C_DIM}# ephemeral E2E stack (recommended)${C_RESET}" >&2
printf '%b\n' "  ${C_DIM}# or${C_RESET}" >&2
printf '%b\n' "  ${C_YELLOW}make api-up${C_RESET}           ${C_DIM}# ord-api dev stack${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "${C_DIM}Copy test env if needed: cp .env.e2e.example .env.e2e${C_RESET}" >&2
printf '%b\n' "${C_DIM}Health check: ${HEALTH_URL}${C_RESET}" >&2
printf '%b\n' "" >&2

exit 1
