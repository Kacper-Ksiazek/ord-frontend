#!/usr/bin/env bash
# Print frontend dev status (front + storybook only).
#
# Usage: ./scripts/front-status.sh
# Env:   FRONT_PORT, STORYBOOK_PORT

set -euo pipefail

FRONT_PORT="${FRONT_PORT:-5173}"
STORYBOOK_PORT="${STORYBOOK_PORT:-6006}"

http_up() {
	curl -sf --max-time 2 "$1" >/dev/null 2>&1
}

print_http_service_status() {
	local name="$1"
	local port="$2"

	if http_up "http://localhost:${port}/"; then
		printf '%-11s running at port %s\n' "${name}:" "$port"
	else
		printf '%-11s down\n' "${name}:"
	fi
}

print_http_service_status 'front' "$FRONT_PORT"
print_http_service_status 'storybook' "$STORYBOOK_PORT"
