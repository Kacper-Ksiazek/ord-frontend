.PHONY: help status api-up api-down api-logs docker-e2e-up docker-e2e-down \
	ci ci-e2e \
	test test-unit test-e2e test-e2e-install

.DEFAULT_GOAL := help

ORD_API_DIR ?= $(HOME)/workspace/ord-api
ARGS ?=
COMPOSE_DEV := docker compose -f $(ORD_API_DIR)/docker-compose.yaml
COMPOSE_E2E := docker compose -f $(ORD_API_DIR)/docker-compose.e2e.yml

help:
	@echo "Available targets:"
	@echo "  status              Show docker / api / front / storybook status"
	@echo "  api-up              Start ord-api dev stack (default: $(ORD_API_DIR))"
	@echo "  api-down            Stop ord-api dev stack"
	@echo "  api-logs            Follow ord-api dev stack logs"
	@echo "  docker-e2e-up       Start ephemeral E2E backend (OTP 123456, 4 worker accounts)"
	@echo "  docker-e2e-down     Stop E2E backend stack"
	@echo "  ci                  Run all CI checks (lint, format, types, e2e-types, build, unit-tests)"
	@echo "  ci-e2e              Run CI checks + Playwright E2E (requires docker-e2e-up)"
	@echo "  test                Run unit tests (alias for test-unit)"
	@echo "  test-unit           Vitest unit/component tests"
	@echo "  test-e2e            3 parallel E2E journeys (requires backend — docker-e2e-up or api-up)"
	@echo "  test-e2e-install    Install Playwright Chromium browser"
	@echo ""
	@echo "Override backend path: make docker-e2e-up ORD_API_DIR=/path/to/ord-api"
	@echo "Extra test args:       make test-e2e ARGS='-- --headed'"

status:
	ORD_API_DIR=$(ORD_API_DIR) ORD_FRONTEND_DIR=$(CURDIR) ./scripts/dev-status.sh

api-up:
	$(COMPOSE_DEV) up -d

api-down:
	$(COMPOSE_DEV) down

api-logs:
	$(COMPOSE_DEV) logs -f

docker-e2e-up:
	$(COMPOSE_E2E) up -d --wait

docker-e2e-down:
	$(COMPOSE_E2E) down --remove-orphans

ci:
	./scripts/run-ci.sh

ci-e2e:
	./scripts/run-ci.sh --e2e

test: test-unit

test-unit:
	./scripts/run-tests.sh unit $(ARGS)

test-e2e:
	./scripts/run-tests.sh e2e $(ARGS)

test-e2e-install:
	bun run test:e2e:install
