#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=scripts/dev-common.sh
source "$(dirname "${BASH_SOURCE[0]}")/dev-common.sh"

was_running=false
if http_up "http://localhost:${FRONT_PORT}/"; then
	was_running=true
fi

require_bun
front_dev_down
front_dev_start

if front_dev_wait_healthy; then
	printf '✅ frontend refreshed at port %s\n' "$FRONT_PORT"
	exit 0
fi

if [[ "$was_running" == true ]]; then
	printf '❌ frontend failed to restart — port %s is down\n' "$FRONT_PORT" >&2
else
	printf '❌ frontend failed to start\n' >&2
fi

exit 1
