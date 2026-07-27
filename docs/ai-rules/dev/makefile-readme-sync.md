# Makefile and README sync

The root `Makefile` is the single source of truth for local dev and CI commands. After **any** Makefile change, immediately update the **Development (Makefile)** section in `README.md` so every `make help` target is listed with a matching one-line description.

Follow `ord-api` conventions: `.PHONY` targets, `help` as default, configurable values via `?=`, short target names.

Do not add granular CI Makefile aliases (e.g. `lint`, `format-check`, `check`, `build`). Use `make ci` for all CI checks. Do not add feature-specific test aliases (e.g. `test-e2e-auth`). Use `make test-e2e` or pass paths via `ARGS` until a dedicated test runner exists.

## Good

```
# Makefile: add ci target
ci:
	./scripts/run-ci.sh

# README.md: add row in Development table
| `make ci` | Run all CI checks (lint, format, types, build, unit-tests) |
```

## Bad

```
# Makefile changed but README still lists removed targets
make test-e2e-auth   # removed — not documented, not in help

# granular CI targets — use make ci instead
make lint && make check

# duplicating bun run commands in README when make target exists
bun run lint && bun run check   # README should say: make ci
```
