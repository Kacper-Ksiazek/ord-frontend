# CI verification before finishing a task

After any code change, the agent **must** run `make ci` and fix all failures before considering the task done. This mirrors the GitHub `ci` workflow: lint, format, types, e2e-types, build, unit tests, and dependency audit (`bun audit --audit-level high`).

When changes affect E2E flows, auth, or conversations UI, also run E2E checks. The agent **runs ord-ops itself** — do not ask the user to start stacks.

```bash
cd ~/workspace/ord-ops && make run-e2e    # e2e-up + Playwright (preferred)
# or: make e2e-up && cd ~/workspace/ord-frontend && make ci-e2e
```

Requires `.env.e2e` in ord-frontend.

Do not substitute individual `bun run lint` / `bun run check` calls when `make ci` is available — use the Makefile target so local runs match CI.

## Good

```
# after implementing a feature
make ci

# after changing E2E specs or auth/conversations flows (agent runs this)
cd ~/workspace/ord-ops && make run-e2e
```

## Bad

```
# marking task done without running CI checks
git add . && # no make ci

# running checks ad-hoc instead of the CI bundle
bun run lint && bun run test   # use make ci
```
