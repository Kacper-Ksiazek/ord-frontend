#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=scripts/dev-common.sh
source "$(dirname "${BASH_SOURCE[0]}")/dev-common.sh"

printf '🔄 refreshing paraglide + svelte-kit sync...\n'
(
	cd "$ORD_FRONTEND_DIR"
	bun run aggregate && bun run generate:paraglide && bunx svelte-kit sync
)

front_dev_down
require_bun
front_dev_start

if front_dev_wait_healthy; then
	printf '✅ frontend reset at port %s\n' "$FRONT_PORT"
	exit 0
fi

exit 1
