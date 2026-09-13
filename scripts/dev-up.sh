#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=scripts/dev-common.sh
source "$(dirname "${BASH_SOURCE[0]}")/dev-common.sh"

if http_up "http://localhost:${FRONT_PORT}/"; then
	printf '✅ frontend already running at port %s\n' "$FRONT_PORT"
	exit 0
fi

require_bun
front_dev_start

if front_dev_wait_healthy; then
	printf '✅ frontend started at port %s\n' "$FRONT_PORT"
	exit 0
fi

exit 1
