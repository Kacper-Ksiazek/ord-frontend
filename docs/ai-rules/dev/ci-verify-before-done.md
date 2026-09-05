# CI verification before finishing a task

After any code change, the agent **must** run `make ci` and fix all failures before considering the task done. This mirrors the GitHub `ci` workflow: lint, format, types, e2e-types, build, unit tests, and dependency audit (`bun audit --audit-level high`).

When changes affect E2E flows, auth, or conversations UI, also run `make ci-e2e` (requires `make docker-e2e-up` and `.env.e2e`).

Do not substitute individual `bun run lint` / `bun run check` calls when `make ci` is available — use the Makefile target so local runs match CI.

## Good

```
# after implementing a feature
make ci

# after changing E2E specs or auth/conversations flows
make docker-e2e-up
make ci-e2e
```

## Bad

```
# marking task done without running CI checks
git add . && # no make ci

# running checks ad-hoc instead of the CI bundle
bun run lint && bun run test   # use make ci
```
