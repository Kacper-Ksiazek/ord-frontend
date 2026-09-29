# E2E tests: Playwright journeys + page objects

E2E tests live in `e2e/` with their own config (`e2e/playwright.config.ts`):

- **Specs:** `e2e/journeys/*.spec.ts` — one critical user journey per file (auth, conversations, words, …)
- **Page objects:** `e2e/features/<feature>/pages/` and `components/` (mirrors `src/lib/features/`)
- **Shared:** `e2e/shared/` — fixtures, env, helpers
- **Types:** `e2e/tsconfig.json` — `@e2e/*` and `$lib/*` path aliases; run `bun run check:e2e`

Specs import `test`/`expect` from `@e2e/shared/fixtures/*` (not directly from `@playwright/test`). Page objects use `getByTestId` with ids from `@e2e/<feature>/test-ids`. Run with `make test-e2e`.

**Parallel workers:** `workers: 3` — each worker maps to `e2e-ci-w{n}@ord.test` via `emailForWorker(testInfo.workerIndex)` or the `authenticatedPage` fixture.

**App bugs:** if a journey fails unless you work around product behavior, stop and notify the developer — see `testing/e2e-app-bugs-block-tests.md`. Do not ship specs that pass only via reload, cache bust, or API-only shortcuts.

## New user-facing flows → new journey (automatic test loop)

When a PR adds a **new user path** (modal, query deep link such as `?modal=…`, new screen, or visible SSE-driven flow), add a matching spec under `e2e/journeys/` — **prefer the same PR** as the feature. A follow-up PR is acceptable only when the e2e stack is blocked; link it in the feature PR and land it immediately after — do not defer journeys indefinitely.

Each journey exercises the path end-to-end (auth fixtures, page objects, `getByTestId` from the feature’s `testing/test-ids`), not micro UI assertions (those belong in Vitest). For modals tied to URL state, cover at least: open (control and/or deep link), close (param removed), coexisting list filters unchanged, and a minimal happy path (mock SSE/API consistent with other feature e2e patterns).

**Automatic test loop:** unit tests via `make ci` plus the blocking CI **`e2e`** job on PRs. A shipped flow without a journey is manually testable only and outside the regression loop.

See also [`dev/ci-verify-before-done.md`](../dev/ci-verify-before-done.md) for running e2e locally before merge.

## Directory layout

```
e2e/
├── playwright.config.ts
├── journeys/              # regression specs only
├── shared/
│   ├── fixtures/
│   └── helpers/
└── features/
    ├── auth/pages/
    ├── app-layouts/components/
    ├── conversations/{list,create,session}/pages/
    └── words/{pages,components}/
```

## Local setup

- Copy `.env.e2e.example` → `.env.e2e` at the **repo root**.
- Backend: `ord-ops make e2e-up` (e2e stack, OTP `123456`). Dev stack: `ord-ops make dev-up` + `make test-dev`.
- Journeys skip when `E2E_OTP_CODE` / `E2E_OTP_FETCH_URL` is missing.
- Demo videos: `make test-e2e-record-report` (record + open report). Helpers: `test-e2e-record`, `test-e2e-report`, `test-e2e-clean`, `test-dev-record`.

## CI

- Workflow: `.github/workflows/e2e.yml` — job **`e2e`**, blocking on PRs.
- Backend image pinned: `.github/ord-api-e2e-image.sha`.

## Good

```ts
// e2e/journeys/00-auth-journey.spec.ts
import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { emailForWorker, isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { createConversationsListPage } from '@e2e/conversations/list';

test.describe('Auth journey', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('login, access app, logout', async ({ page, loginPage }, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);
		const conversationsListPage = createConversationsListPage(page);

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/login/);
		await loginPage.loginWithOtp(email);
		await conversationsListPage.expectLoaded();
	});
});
```

## Bad

```ts
// Feature PR ships modal + URL helpers with Vitest only — no e2e/journeys/* spec (regression gap)
```

```ts
// Multiple micro-tests for UI validation — use Vitest instead
test('submit button is disabled when email has no @ symbol', async ({ loginPage }) => { ... });

// API seed instead of user journey
const { id } = await seedConversationViaApi(page);
await conversationSessionPage.goto(id);

// Hardcoded email — breaks parallel workers
await loginPage.loginWithOtp(testEnv.testEmail);
```
