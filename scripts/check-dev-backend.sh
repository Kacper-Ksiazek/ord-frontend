#!/usr/bin/env bash
# Fail fast when the dev backend API is not running.
#
# Usage: ./scripts/check-dev-backend.sh
# Skip:  SKIP_DEV_BACKEND_CHECK=1 ./scripts/check-dev-backend.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"

if [[ "${SKIP_DEV_BACKEND_CHECK:-}" == "1" ]]; then
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

API_URL="$(read_env_var PUBLIC_API_URL || echo 'http://localhost:8080')"
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
printf '%b\n' "${C_RED}${C_BOLD}⚠️  Dev backend is not reachable${C_RESET}" >&2
printf '%b\n' "${C_RED}   ${API_URL}${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "${C_RED}Start the dev stack first, then run tests again:${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "  ${C_YELLOW}cd ../ord-ops && make dev-up${C_RESET}    ${C_DIM}# dev stack (API docker + frontend)${C_RESET}" >&2
printf '%b\n' "  ${C_DIM}# or${C_RESET}" >&2
printf '%b\n' "  ${C_YELLOW}cd ../ord-ops && make api-run${C_RESET}   ${C_DIM}# native API + Docker DB${C_RESET}" >&2
printf '%b\n' "" >&2
printf '%b\n' "${C_DIM}Copy env if needed: cp .env.example .env${C_RESET}" >&2
printf '%b\n' "${C_DIM}Health check: ${HEALTH_URL}${C_RESET}" >&2
printf '%b\n' "" >&2

exit 1
