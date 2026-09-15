# E2E tests (Playwright)

Regression smoke for **ord-frontend** — five parallel user journeys, not per-component integration tests.

## Journeys

| File                                                    | Worker | Account              | Flow                                                                                  |
| ------------------------------------------------------- | ------ | -------------------- | ------------------------------------------------------------------------------------- |
| `e2e/journeys/00-auth-journey.spec.ts`                  | 0      | `e2e-ci-w0@ord.test` | Login → conversations list → logout → private route blocked                           |
| `e2e/journeys/01-core-flow-journey.spec.ts`             | 1      | `e2e-ci-w1@ord.test` | List → create conversation (UI) → live session → TTS on AI/user messages → AI reply   |
| `e2e/journeys/02-resume-conversation-journey.spec.ts`   | 2      | `e2e-ci-w2@ord.test` | Create + chat + TTS → back to list → reopen row → persisted messages + TTS still work |
| `e2e/journeys/03-words-capture-fill-ai-journey.spec.ts` | *      | `e2e-ci-w*@ord.test` | Words inbox → capture modal → Fill with AI → save → word in list → detail TTS         |
| `e2e/journeys/04-words-generate-manual-journey.spec.ts` | *      | `e2e-ci-w*@ord.test` | Words inbox → Generate with AI manual → TTS on source word and example sentence       |

Each journey is **one test per file**. Workers run in parallel (`workers: 3`); Playwright assigns `workerIndex` per run (mapped to `e2e-ci-w{n}@ord.test` via modulo). Words journeys use unique source words per run to avoid cross-test collisions.

## What CI covers vs. intentionally uncovered

| Area                                                      | Covered by                         | Notes                                                 |
| --------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------- |
| Auth OTP, session, logout guards                          | `00-auth-journey`                  | Full UI login path                                    |
| Create flow + live SSE chat + message TTS                 | `01-core-flow-journey`             | AI learning-tips TTS + user tutor-comment TTS         |
| List → row → session resume (SPA) + TTS                   | `02-resume-conversation-journey`   | Guards stale cache on reopen (regression from PR #44) |
| Words capture modal + Fill with AI + save + TTS           | `03-words-capture-fill-ai-journey` | Stubbed AI fill-gaps on e2e backend profile           |
| Words list → detail panel → Generate with AI manual + TTS | `04-words-generate-manual-journey` | Source word + example sentence TTS                    |
| List filters, topic suggestions, wizard step validation   | —                                  | **Not in E2E** — unit/component tests or manual QA    |
| Feedback panel, activity heatmap                          | —                                  | **Not in E2E** — deferred                             |

Deleted integration specs from PR #49 are **not** replaced 1:1 in Vitest yet. The journeys above are the explicit regression contract; gaps are accepted for a hobby-project scope.

## Run locally

```bash
cp .env.e2e.example .env.e2e
cd ../ord-ops && make e2e-up
make test-e2e-install   # once
make test-e2e
```

Record a **video for every journey** (demo / walkthrough; default keeps video only on failure):

```bash
make test-e2e-record-report   # record + open HTML report
# or step by step:
make test-e2e-record
make test-e2e-report
make test-e2e-clean           # remove e2e/test-results + playwright-report
```

Or set `E2E_RECORD_VIDEO=true` in `.env.e2e`. Videos land under `e2e/test-results/` and are linked from the HTML report.

Playwright on the **dev stack** (same journeys, `.env` instead of `.env.e2e`):

```bash
cp .env.example .env    # set PUBLIC_DEV_LOGIN_EMAIL
cd ../ord-ops && make dev-up
make test-dev
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

Add a file under `e2e/journeys/` only for a **new critical user path** that existing journeys do not already guard. Update the coverage table above. Prefer Vitest for form validation, URL param logic, and isolated UI states.

Use `emailForWorker(testInfo.workerIndex)` or the `authenticatedPage` fixture — never hardcode `testEnv.testEmail` in specs.
