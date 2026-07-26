#!/usr/bin/env bash
# Run CI checks locally — mirrors .github/workflows/ci.yml (and optionally e2e).
#
# Usage:
#   ./scripts/run-ci.sh          # lint → format → types → build → unit-tests
#   ./scripts/run-ci.sh --e2e    # above + Playwright E2E (requires backend)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INCLUDE_E2E=0

if [[ "${1:-}" == "--e2e" ]]; then
  INCLUDE_E2E=1
fi

cd "$ROOT"

if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
  C_RESET=$'\033[0m'
  C_BOLD=$'\033[1m'
  C_DIM=$'\033[2m'
  C_CYAN=$'\033[36m'
  C_GREEN=$'\033[32m'
  C_RED=$'\033[31m'
else
  C_RESET=""
  C_BOLD=""
  C_DIM=""
  C_CYAN=""
  C_GREEN=""
  C_RED=""
fi

format_elapsed() {
  local total="$1"
  printf "%02d:%02d" $((total / 60)) $((total % 60))
}

run_step() {
  local name="$1"
  shift

  printf '%b\n' "${C_CYAN}► ${name}${C_RESET}"
  local start
  start=$(date +%s)

  if "$@"; then
    local elapsed=$(( $(date +%s) - start ))
    printf '%b\n\n' "${C_GREEN}✓ ${name}${C_RESET} ${C_DIM}($(format_elapsed "$elapsed"))${C_RESET}"
  else
    printf '%b\n' "${C_RED}✗ ${name} failed${C_RESET}"
    exit 1
  fi
}

printf '%b\n' "${C_BOLD}CI checks${C_RESET} ${C_DIM}(matches GitHub workflow ci.yml)${C_RESET}"
echo ""

run_step "lint" bun run lint
run_step "format" bun run format:check
run_step "types" bun run check
run_step "build" bun run build
run_step "unit-tests" ./scripts/run-tests.sh unit

if [[ "$INCLUDE_E2E" -eq 1 ]]; then
  run_step "e2e" ./scripts/run-tests.sh e2e
fi

printf '%b\n' "${C_GREEN}${C_BOLD}All CI checks passed.${C_RESET}"
