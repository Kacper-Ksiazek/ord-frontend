#!/usr/bin/env bash
# Thin wrapper around bun test commands (reporters live in vitest/playwright config).
#
# Usage:
#   ./scripts/run-tests.sh unit
#   ./scripts/run-tests.sh e2e
#   ./scripts/run-tests.sh dev
#
# Extra args are forwarded to Vitest / Playwright (after --), e.g.:
#   ./scripts/run-tests.sh e2e -- --headed

set -euo pipefail

MODE="${1:-}"
shift || true

if [[ "$MODE" == "--" ]]; then
	MODE=""
fi

EXTRA_ARGS=()
if [[ $# -gt 0 ]]; then
	if [[ "$1" == "--" ]]; then
		shift
	fi
	EXTRA_ARGS=("$@")
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

read_env_file() {
	local env_file="$1"

	if [[ ! -f "$env_file" ]]; then
		return 1
	fi

	set -a
	# shellcheck disable=SC1090
	source "$env_file"
	set +a
}

export_dev_playwright_env() {
	if ! read_env_file "$ROOT/.env"; then
		echo "WARN: .env not found — copy .env.example and set PUBLIC_DEV_LOGIN_EMAIL" >&2
	fi

	export ORD_PLAYWRIGHT_ENV=dev
	export E2E_API_URL="${PUBLIC_API_URL:-http://localhost:8080}"
	export E2E_BASE_URL="${E2E_BASE_URL:-http://localhost:5173}"
	export E2E_OTP_CODE="${PUBLIC_DEV_LOGIN_OTP:-123456}"
	export E2E_TEST_EMAIL="${PUBLIC_DEV_LOGIN_EMAIL:-}"
	export E2E_WORKER_COUNT=1
}

case "$MODE" in
	unit)
		if ((${#EXTRA_ARGS[@]})); then
			exec bun run test -- "${EXTRA_ARGS[@]}"
		else
			exec bun run test
		fi
		;;
	e2e)
		if [[ ! -f "$ROOT/.env.e2e" ]]; then
			echo "WARN: .env.e2e not found — E2E auth specs will skip (copy .env.e2e.example)" >&2
		fi
		./scripts/check-e2e-backend.sh
		if ((${#EXTRA_ARGS[@]})); then
			exec bun run test:e2e -- "${EXTRA_ARGS[@]}"
		else
			exec bun run test:e2e
		fi
		;;
	dev)
		export_dev_playwright_env
		./scripts/check-dev-backend.sh
		if ((${#EXTRA_ARGS[@]})); then
			exec bun run test:e2e -- --workers=1 "${EXTRA_ARGS[@]}"
		else
			exec bun run test:e2e -- --workers=1
		fi
		;;
	*)
		cat >&2 <<'EOF'
Usage: ./scripts/run-tests.sh <mode> [-- extra-args...]

Modes:
  unit    Vitest unit/component tests
  e2e     Playwright journeys on e2e stack (.env.e2e)
  dev     Playwright journeys on dev stack (.env)
EOF
		exit 2
		;;
esac
