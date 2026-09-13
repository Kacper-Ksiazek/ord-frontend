.PHONY: help status run restart stop reset refresh wipe ci ci-e2e \
	test test-e2e test-e2e-ui test-dev test-dev-ui test-e2e-install \
	test-unit dev dev-refresh dev-stop

.DEFAULT_GOAL := help

ARGS ?=

help:
	@echo "Available targets:"
	@echo ""
	@echo "🔍 Status:"
	@echo "  status              Frontend + storybook status"
	@echo ""
	@echo "💻 Dev server:"
	@echo "  run                 Start frontend dev server"
	@echo "  restart             Restart frontend dev server"
	@echo "  stop                Stop frontend dev server"
	@echo "  reset               Refresh paraglide/sync and restart dev server"
	@echo ""
	@echo "🔄 Dev cache:"
	@echo "  refresh             Regenerate paraglide + svelte-kit sync"
	@echo "  wipe                Hard reset frontend dev cache"
	@echo ""
	@echo "✅ CI:"
	@echo "  ci                  Static checks + unit tests"
	@echo "  ci-e2e              ci + Playwright (requires ord-ops: make e2e-up)"
	@echo ""
	@echo "🧪 Tests:"
	@echo "  test                Vitest unit/component tests"
	@echo "  test-e2e            Playwright on e2e stack (ord-ops: make e2e-up)"
	@echo "  test-e2e-ui         Playwright UI mode on e2e stack"
	@echo "  test-dev            Playwright on dev stack (ord-ops: make dev-up)"
	@echo "  test-dev-ui         Playwright UI mode on dev stack"
	@echo "  test-e2e-install    Install Playwright Chromium browser"
	@echo ""
	@echo "Extra test args: make test-e2e ARGS='-- --headed'"
	@echo "Filter journeys:   make test-e2e-ui ARGS='journeys/03-words-capture-fill-ai-journey.spec.ts'"

status:
	./scripts/front-status.sh

run:
	./scripts/dev-up.sh

restart:
	./scripts/dev-restart.sh

stop:
	./scripts/dev-down.sh

reset:
	./scripts/dev-reset.sh

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

test-e2e-ui:
	./scripts/run-tests.sh e2e -- --ui $(ARGS)

test-dev:
	./scripts/run-tests.sh dev $(ARGS)

test-dev-ui:
	./scripts/run-tests.sh dev -- --ui $(ARGS)

test-e2e-install:
	bun run test:e2e:install

# Deprecated aliases (hidden from help)
dev: run
dev-refresh: restart
dev-stop: stop
test-unit: test
