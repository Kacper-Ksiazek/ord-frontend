# E2E tests (Playwright)

Regression smoke for **ord-frontend** — two parallel user journeys, not per-component integration tests.

## Journeys

| File                                        | Worker | Account              | Flow                                                                     |
| ------------------------------------------- | ------ | -------------------- | ------------------------------------------------------------------------ |
| `e2e/journeys/00-auth-journey.spec.ts`      | 0      | `e2e-ci-w0@ord.test` | Login → conversations list → logout → private route blocked              |
| `e2e/journeys/01-core-flow-journey.spec.ts` | 1      | `e2e-ci-w1@ord.test` | List → create conversation (UI) → live session → send message → AI reply |

Each journey is **one test per file**. Workers run in parallel (`workers: 2`); each worker uses a dedicated e2e account (backend allows one active session per user).

## Run locally

```bash
cp .env.e2e.example .env.e2e
make docker-e2e-up
make test-e2e-install   # once
make test-e2e
```

Without `.env.e2e` or OTP config, tests **skip** (do not fail).

## Structure

```
e2e/
├── journeys/           # specs only
├── features/           # page objects (auth, conversations, app-layouts)
└── shared/             # fixtures, env, helpers
```

Page objects live under `e2e/features/` and mirror `src/lib/features/`. Specs import factories from `@e2e/<feature>` barrels — no selectors in spec files.

## CI

- Workflow: `.github/workflows/e2e.yml` — blocking on PRs.
- Backend image pinned: `.github/ord-api-e2e-image.sha` → `ghcr.io/kacper-ksiazek/ord-api:sha-<commit>`.
- Typecheck: `bun run check:e2e`.

## Adding a new journey

Only when a **new critical user path** needs regression coverage (e.g. feedback panel becomes core). Add one file under `e2e/journeys/` with one test. Everything else belongs in Vitest.

Use `emailForWorker(testInfo.workerIndex)` or the `authenticatedPage` fixture — never hardcode `testEnv.testEmail` in specs.
