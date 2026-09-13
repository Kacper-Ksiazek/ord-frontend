#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=scripts/dev-common.sh
source "$(dirname "${BASH_SOURCE[0]}")/dev-common.sh"

front_dev_down
printf '✅ frontend stopped\n'
