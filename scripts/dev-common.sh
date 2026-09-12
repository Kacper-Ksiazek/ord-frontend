#!/usr/bin/env bash
# Shared helpers for managed frontend dev server (vite).

ORD_FRONTEND_DIR="${ORD_FRONTEND_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
FRONT_PORT="${FRONT_PORT:-5173}"
RUNTIME_DIR="$ORD_FRONTEND_DIR/.runtime"
FRONT_DEV_PID_FILE="$RUNTIME_DIR/frontend-dev.pid"
FRONT_DEV_LOG_FILE="$RUNTIME_DIR/frontend-dev.log"
FRONT_DEV_HEALTH_TIMEOUT="${FRONT_DEV_HEALTH_TIMEOUT:-30}"

# Legacy path when frontend was started from ord-ops before scripts lived here.
ORD_OPS_RUNTIME_DIR="${ORD_OPS_RUNTIME_DIR:-$ORD_FRONTEND_DIR/../ord-ops/.runtime}"
LEGACY_FRONT_DEV_PID_FILE="$ORD_OPS_RUNTIME_DIR/frontend-dev.pid"

http_up() {
	local url="$1"
	local timeout="${2:-2}"

	curl -sfL --max-time "$timeout" "$url" >/dev/null 2>&1
}

ensure_runtime_dir() {
	mkdir -p "$RUNTIME_DIR"
}

require_bun() {
	if ! command -v bun >/dev/null 2>&1; then
		printf '❌ bun not found — install Bun 1.4.1+\n' >&2
		exit 1
	fi
}

stop_process_tree() {
	local pid="$1"
	local child

	[[ -n "$pid" ]] || return 0
	kill "$pid" 2>/dev/null || true
	while read -r child; do
		[[ -n "$child" ]] && stop_process_tree "$child"
	done < <(pgrep -P "$pid" 2>/dev/null || true)
}

front_dev_read_pid() {
	local pid

	if [[ -f "$FRONT_DEV_PID_FILE" ]]; then
		pid="$(<"$FRONT_DEV_PID_FILE")"
		if [[ -n "$pid" ]]; then
			printf '%s' "$pid"
			return 0
		fi
	fi

	if [[ -f "$LEGACY_FRONT_DEV_PID_FILE" ]]; then
		pid="$(<"$LEGACY_FRONT_DEV_PID_FILE")"
		if [[ -n "$pid" ]]; then
			printf '%s' "$pid"
			return 0
		fi
	fi

	return 1
}

front_dev_kill_port_listeners() {
	local pid

	while read -r pid; do
		[[ -n "$pid" ]] && kill "$pid" 2>/dev/null || true
	done < <(lsof -ti ":$FRONT_PORT" 2>/dev/null || true)
}

front_dev_down() {
	local pid

	if front_dev_read_pid; then
		pid="$(front_dev_read_pid)"
		stop_process_tree "$pid"
	fi

	front_dev_kill_port_listeners
	rm -f "$FRONT_DEV_PID_FILE" "$LEGACY_FRONT_DEV_PID_FILE"
}

front_dev_start() {
	ensure_runtime_dir
	: >"$FRONT_DEV_LOG_FILE"

	(
		cd "$ORD_FRONTEND_DIR"
		nohup bun run dev >>"$FRONT_DEV_LOG_FILE" 2>&1 &
		printf '%s' "$!" >"$FRONT_DEV_PID_FILE"
	)
}

front_dev_print_log_tail() {
	local lines="${1:-30}"

	if [[ ! -f "$FRONT_DEV_LOG_FILE" ]]; then
		return 0
	fi

	printf '\n--- last %s lines of %s ---\n' "$lines" "$FRONT_DEV_LOG_FILE" >&2
	tail -n "$lines" "$FRONT_DEV_LOG_FILE" >&2
}

front_dev_fail() {
	local reason="$1"

	printf '❌ %s\n' "$reason" >&2
	front_dev_print_log_tail 40
}

front_dev_wait_healthy() {
	local health_url="http://localhost:${FRONT_PORT}/"
	local attempt=0
	local pid=""

	if front_dev_read_pid; then
		pid="$(front_dev_read_pid)"
	fi

	while [[ "$attempt" -lt "$FRONT_DEV_HEALTH_TIMEOUT" ]]; do
		if http_up "$health_url"; then
			return 0
		fi

		if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
			front_dev_fail "frontend process exited before dev server became ready"
			return 1
		fi

		attempt=$((attempt + 1))
		sleep 1
	done

	front_dev_fail "dev server timed out after ${FRONT_DEV_HEALTH_TIMEOUT}s"
	return 1
}
