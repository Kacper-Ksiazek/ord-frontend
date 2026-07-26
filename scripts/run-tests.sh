#!/usr/bin/env bash
# Run frontend test suites with a quiet live progress line and a summary at the end.
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
TARGET_DIR="$ROOT/target"
LOG_FILE="$TARGET_DIR/test-run.log"
PARSER="$ROOT/scripts/test-report-parser.py"

cd "$ROOT"
mkdir -p "$TARGET_DIR"
: >"$LOG_FILE"

REPORT_KIND=""
REPORT_FILE=""
LABEL=""
CMD=()

case "$MODE" in
  unit)
    LABEL="Unit tests"
    REPORT_KIND="vitest"
    REPORT_FILE="$TARGET_DIR/vitest-results.json"
    rm -f "$REPORT_FILE"
    CMD=(bun run test -- --reporter=json --outputFile="$REPORT_FILE" --reporter=dot)
    if ((${#EXTRA_ARGS[@]})); then
      CMD+=("${EXTRA_ARGS[@]}")
    fi
    ;;
  e2e)
    LABEL="E2E tests"
    REPORT_KIND="playwright"
    REPORT_FILE="$TARGET_DIR/e2e-results.json"
    rm -f "$REPORT_FILE"
    export PLAYWRIGHT_JSON_OUTPUT_NAME="$REPORT_FILE"
    ./scripts/check-e2e-backend.sh
    CMD=(bun run test:e2e -- --reporter=list --reporter=json)
    if ((${#EXTRA_ARGS[@]})); then
      CMD+=("${EXTRA_ARGS[@]}")
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

if [[ "$REPORT_KIND" == "playwright" ]]; then
  if [[ ! -f "$ROOT/.env.e2e" ]]; then
    echo "WARN: .env.e2e not found — E2E auth specs will skip (copy .env.e2e.example)" >&2
  fi
fi

if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
  C_RESET=$'\033[0m'
  C_BOLD=$'\033[1m'
  C_DIM=$'\033[2m'
  C_CYAN=$'\033[36m'
  C_GREEN=$'\033[32m'
  C_RED=$'\033[31m'
  C_YELLOW=$'\033[33m'
  USE_COLOR=1
else
  C_RESET=""
  C_BOLD=""
  C_DIM=""
  C_CYAN=""
  C_GREEN=""
  C_RED=""
  C_YELLOW=""
  USE_COLOR=0
fi

format_elapsed() {
  local total="$1"
  local minutes=$((total / 60))
  local seconds=$((total % 60))
  printf "%02d:%02d" "$minutes" "$seconds"
}

read_stats() {
  python3 "$PARSER" "$REPORT_KIND" "$REPORT_FILE" 2>/dev/null || echo '{"totals":{"tests":0,"passed":0,"failures":0,"errors":0,"skipped":0},"failed_cases":[]}'
}

count_from_log() {
  local passed failed
  passed=$(grep -Ec '✓|passed' "$LOG_FILE" 2>/dev/null || true)
  failed=$(grep -Ec '✘|failed' "$LOG_FILE" 2>/dev/null || true)
  printf '%s %s' "${passed:-0}" "${failed:-0}"
}

print_progress() {
  local elapsed="$1"
  local stats_json="$2"
  local tests passed failures errors skipped
  read -r tests passed failures errors skipped < <(python3 -c "
import json, sys
t = json.loads(sys.argv[1])['totals']
print(t['tests'], t['passed'], t['failures'], t['errors'], t['skipped'])
" "$stats_json")

  if [[ "$REPORT_KIND" == "playwright" ]] && [[ "$tests" -eq 0 ]]; then
    read -r log_passed log_failed < <(count_from_log)
    if [[ "$log_passed" -gt 0 || "$log_failed" -gt 0 ]]; then
      tests=$((log_passed + log_failed))
      passed=$log_passed
      failures=$log_failed
    fi
  fi

  local line
  if [[ "$tests" -eq 0 ]]; then
    line="${C_CYAN}${LABEL}${C_RESET}  ${C_DIM}$(format_elapsed "$elapsed")${C_RESET}  ${C_YELLOW}running...${C_RESET}"
  else
    line="${C_CYAN}${LABEL}${C_RESET}  ${C_DIM}$(format_elapsed "$elapsed")${C_RESET}  run: ${C_BOLD}${tests}${C_RESET}  passed: ${C_GREEN}${passed}${C_RESET}  failed: ${C_RED}${failures}${C_RESET}  errors: ${C_RED}${errors}${C_RESET}  skipped: ${C_YELLOW}${skipped}${C_RESET}"
  fi

  if [[ -t 1 ]]; then
    printf '\033[2K\r%s' "$line"
  elif [[ "$elapsed" -eq 0 || $((elapsed - LAST_PROGRESS_AT)) -ge 5 ]]; then
    printf '%b\n' "$line"
    LAST_PROGRESS_AT=$elapsed
  fi
}

print_summary() {
  local elapsed="$1"
  local exit_code="$2"

  FINAL_STATS="$FINAL_STATS" ELAPSED="$elapsed" EXIT_CODE="$exit_code" LOG_FILE="$LOG_FILE" \
    C_RESET="$C_RESET" C_BOLD="$C_BOLD" C_DIM="$C_DIM" C_CYAN="$C_CYAN" C_GREEN="$C_GREEN" \
    C_RED="$C_RED" C_YELLOW="$C_YELLOW" USE_COLOR="$USE_COLOR" \
    python3 <<'PY'
import json
import os

def c(name: str) -> str:
    if os.environ.get("USE_COLOR") != "1":
        return ""
    return os.environ.get(f"C_{name.upper()}", "")

data = json.loads(os.environ["FINAL_STATS"])
elapsed = os.environ["ELAPSED"]
exit_code = int(os.environ["EXIT_CODE"])
log_file = os.environ["LOG_FILE"]
totals = data["totals"]
failed_cases = data["failed_cases"]
broken = totals["failures"] + totals["errors"]
success = broken == 0 and exit_code == 0

print()
print(f"{c('DIM')}{'=' * 60}{c('RESET')}")
print(f"  {c('BOLD')}{totals['tests']}{c('RESET')} tests in {c('CYAN')}{elapsed}{c('RESET')}")
print(f"{c('DIM')}{'=' * 60}{c('RESET')}")
print(f"  Passed:  {c('GREEN')}{totals['passed']}{c('RESET')}")
print(f"  Failed:  {c('RED') if totals['failures'] else ''}{totals['failures']}{c('RESET')}")
print(f"  Errors:  {c('RED') if totals['errors'] else ''}{totals['errors']}{c('RESET')}")
print(f"  Skipped: {c('YELLOW') if totals['skipped'] else ''}{totals['skipped']}{c('RESET')}")
print()

if failed_cases:
    print(f"{c('RED')}{c('BOLD')}Failed tests ({len(failed_cases)}):{c('RESET')}")
    print(f"{c('DIM')}{'-' * 60}{c('RESET')}")
    for case in failed_cases:
        kind_color = c("RED") if case["kind"] in {"FAIL", "TIMEOUT"} else c("YELLOW")
        print(f"  {kind_color}[{case['kind']}]{c('RESET')} {c('BOLD')}{case['class']}{c('RESET')}")
        print(f"         {case['name']}")
        if case["message"]:
            print(f"         {c('DIM')}{case['message']}{c('RESET')}")
        print()
elif broken == 0 and exit_code != 0:
    print(f"{c('RED')}Test runner failed before results were written.{c('RESET')}")
    print(f"{c('DIM')}See log: {log_file}{c('RESET')}")
    print()

if success:
    print(f"{c('GREEN')}{c('BOLD')}All tests passed.{c('RESET')}")
else:
    print(f"{c('RED')}{c('BOLD')}Result: FAILED{c('RESET')}  {c('DIM')}(log: {log_file}){c('RESET')}")
PY
}

printf '%b\n' "${C_CYAN}${LABEL}${C_RESET} — starting..."
printf '%b\n' "${C_DIM}Full log: ${LOG_FILE}${C_RESET}"
echo ""

START_EPOCH=$(date +%s)
LAST_PROGRESS_AT=-5
RUN_EXIT=0

"${CMD[@]}" >"$LOG_FILE" 2>&1 &
RUN_PID=$!

set +e
while kill -0 "$RUN_PID" 2>/dev/null; do
  NOW=$(date +%s)
  ELAPSED=$((NOW - START_EPOCH))
  STATS="$(read_stats)"
  print_progress "$ELAPSED" "$STATS"
  sleep 0.4
done
wait "$RUN_PID"
RUN_EXIT=$?
set -e

END_EPOCH=$(date +%s)
ELAPSED=$((END_EPOCH - START_EPOCH))
FINAL_STATS="$(read_stats)"

printf '\033[2K\r'
print_summary "$(format_elapsed "$ELAPSED")" "$RUN_EXIT"

exit "$RUN_EXIT"
