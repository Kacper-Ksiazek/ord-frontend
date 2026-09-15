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

API_URL="$(read_env_var E2E_API_URL || read_env_var PUBLIC_API_URL || echo 'http://localhost:8080')"
HEALTH_URL="${API_URL%/}/api/v1/health-check"
FILL_GAPS_URL="${API_URL%/}/api/v1/words/ai/fill-gaps"

if curl -sf --max-time 3 "$HEALTH_URL" > /dev/null 2>&1; then
  fill_gaps_status="000"
  otp_code="$(read_env_var E2E_OTP_CODE || true)"
  probe_email="$(read_env_var E2E_TEST_EMAIL || echo 'e2e-ci-w0@ord.test')"

  if [[ -n "$otp_code" ]]; then
    cookie_jar="$(mktemp)"
    trap 'rm -f "$cookie_jar"' EXIT

    curl -sf --max-time 5 -X POST \
      -H 'Content-Type: application/json' \
      -d "{\"email\":\"${probe_email}\"}" \
      "${API_URL%/}/api/v1/auth/otp-request" > /dev/null 2>&1 || true

    curl -sf --max-time 5 -X POST \
      -H 'Content-Type: application/json' \
      -d "{\"email\":\"${probe_email}\",\"code\":\"${otp_code}\"}" \
      -c "$cookie_jar" \
      "${API_URL%/}/api/v1/auth/otp-verify" > /dev/null 2>&1 || true

    fill_gaps_status="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -X POST \
      -b "$cookie_jar" \
      -H 'Content-Type: application/json' \
      -d '{"language":"ENGLISH","items":[{"sourceWord":"e2e-probe"}]}' \
      "$FILL_GAPS_URL" 2>/dev/null || echo '000')"
  fi

  if [[ "$fill_gaps_status" == "404" ]]; then
    printf '%b\n' "" >&2
    printf '%b\n' "${C_RED}${C_BOLD}⚠️  E2E backend is too old for words journeys${C_RESET}" >&2
    printf '%b\n' "${C_RED}   Missing POST /api/v1/words/ai/fill-gaps (HTTP 404)${C_RESET}" >&2
    printf '%b\n' "" >&2
    printf '%b\n' "${C_RED}Use the pinned API image, then restart the stack:${C_RESET}" >&2
    printf '%b\n' "" >&2
    printf '%b\n' "  ${C_YELLOW}cd ../ord-ops && make e2e-down && make e2e-up${C_RESET}" >&2
    printf '%b\n' "${C_DIM}Pin: ord-frontend/.github/ord-api-e2e-image.sha${C_RESET}" >&2
    printf '%b\n' "" >&2
    exit 1
  fi

  exit 0
fi

printf '%b\n' "" >&2
printf '%b\n' "${C_RED}${C_BOLD}⚠️  E2E backend is not reachable${C_RESET}" >&2
printf '%b\n' "${C_RED}   ${API_URL}${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "${C_RED}Start the API first, then run E2E tests again:${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "  ${C_YELLOW}cd ../ord-ops && make e2e-up${C_RESET}    ${C_DIM}# ephemeral E2E stack${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "${C_DIM}Copy test env if needed: cp .env.e2e.example .env.e2e${C_RESET}" >&2
printf '%b\n' "${C_DIM}Health check: ${HEALTH_URL}${C_RESET}" >&2
printf '%b\n' "" >&2

exit 1
