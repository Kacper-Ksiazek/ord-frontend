#!/usr/bin/env bash
# Thin wrapper around bun test commands (reporters live in vitest/playwright config).
#
# Usage:
#   ./scripts/run-tests.sh unit
#   ./scripts/run-tests.sh e2e
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
  *)
    cat >&2 <<'EOF'
Usage: ./scripts/run-tests.sh <mode> [-- extra-args...]

Modes:
  unit    Vitest unit/component tests
  e2e     All Playwright E2E flows
EOF
    exit 2
    ;;
esac
