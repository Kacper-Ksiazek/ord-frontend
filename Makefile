.PHONY: help status refresh wipe ci ci-e2e \
	test test-e2e test-dev test-e2e-install \
	test-unit reset

.DEFAULT_GOAL := help

ARGS ?=

help:
	@echo "Available targets:"
	@echo "  status              Frontend + storybook status"
	@echo "  refresh             Regenerate paraglide + svelte-kit sync"
	@echo "  wipe                Hard reset frontend dev cache"
	@echo "  ci                  Static checks + unit tests"
	@echo "  ci-e2e              ci + Playwright (requires ord-ops: make e2e-up)"
	@echo "  test                Vitest unit/component tests"
	@echo "  test-e2e            Playwright on e2e stack (ord-ops: make e2e-up)"
	@echo "  test-dev            Playwright on dev stack (ord-ops: make dev-up)"
	@echo "  test-e2e-install    Install Playwright Chromium browser"
	@echo ""
	@echo "Extra test args: make test-e2e ARGS='-- --headed'"

status:
	./scripts/front-status.sh

refresh:
	bun run aggregate && bun run generate:paraglide && bunx svelte-kit sync

wipe: refresh
	rm -rf .svelte-kit

ci:
	./scripts/run-ci.sh

ci-e2e:
	./scripts/run-ci.sh --e2e

test:
	./scripts/run-tests.sh unit $(ARGS)

test-e2e:
	./scripts/run-tests.sh e2e $(ARGS)

test-dev:
	./scripts/run-tests.sh dev $(ARGS)

test-e2e-install:
	bun run test:e2e:install

# Deprecated aliases (hidden from help)
test-unit: test
reset: wipe
