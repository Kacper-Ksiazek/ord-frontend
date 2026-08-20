# E2E tests (Playwright)

Regression smoke for **ord-frontend** — three parallel user journeys, not per-component integration tests.

## Journeys

| File                                                  | Worker | Account              | Flow                                                                                    |
| ----------------------------------------------------- | ------ | -------------------- | --------------------------------------------------------------------------------------- |
| `e2e/journeys/00-auth-journey.spec.ts`                | 0      | `e2e-ci-w0@ord.test` | Login → conversations list → logout → private route blocked                             |
| `e2e/journeys/01-core-flow-journey.spec.ts`           | 1      | `e2e-ci-w1@ord.test` | List → create conversation (UI) → live session → send message → AI reply                |
| `e2e/journeys/02-resume-conversation-journey.spec.ts` | 2      | `e2e-ci-w2@ord.test` | Create + chat → back to list → reopen row → persisted messages visible (SPA navigation) |

Each journey is **one test per file**. Workers run in parallel (`workers: 3`); each worker uses a dedicated e2e account (backend allows one active session per user).

## What CI covers vs. intentionally uncovered

| Area                                                    | Covered by                       | Notes                                                 |
| ------------------------------------------------------- | -------------------------------- | ----------------------------------------------------- |
| Auth OTP, session, logout guards                        | `00-auth-journey`                | Full UI login path                                    |
| Create flow + live SSE chat                             | `01-core-flow-journey`           | No API seed — UI only                                 |
| List → row → session resume (SPA)                       | `02-resume-conversation-journey` | Guards stale cache on reopen (regression from PR #44) |
| List filters, topic suggestions, wizard step validation | —                                | **Not in E2E** — unit/component tests or manual QA    |
| Feedback panel, TTS, activity heatmap                   | —                                | **Not in E2E** — deferred                             |

Deleted integration specs from PR #49 are **not** replaced 1:1 in Vitest yet. The journeys above are the explicit regression contract; gaps are accepted for a hobby-project scope.

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

Add a file under `e2e/journeys/` only for a **new critical user path** that the three journeys do not already guard. Update the coverage table above. Prefer Vitest for form validation, URL param logic, and isolated UI states.

Use `emailForWorker(testInfo.workerIndex)` or the `authenticatedPage` fixture — never hardcode `testEnv.testEmail` in specs.
