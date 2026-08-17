# E2E tests: Playwright journeys + page objects

E2E tests live in `e2e/` with their own config (`e2e/playwright.config.ts`):

- **Specs:** `e2e/journeys/*.spec.ts` — one critical user journey per file
- **Page objects:** `e2e/features/<feature>/pages/` and `components/` (mirrors `src/lib/features/`)
- **Shared:** `e2e/shared/` — fixtures, env, helpers
- **Types:** `e2e/tsconfig.json` — `@e2e/*` and `$lib/*` path aliases; run `bun run check:e2e`

Specs import `test`/`expect` from `@e2e/shared/fixtures/*` (not directly from `@playwright/test`). Page objects use `getByTestId` with ids from `@e2e/<feature>/test-ids`. Run with `make test-e2e`.

**Parallel workers:** `workers: 3` — each worker maps to `e2e-ci-w{n}@ord.test` via `emailForWorker(testInfo.workerIndex)` or the `authenticatedPage` fixture.

**App bugs:** if a journey fails unless you work around product behavior, stop and notify the developer — see `testing/e2e-app-bugs-block-tests.md`. Do not ship specs that pass only via reload, cache bust, or API-only shortcuts.

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
    └── conversations/{list,create,session}/pages/
```

## Local setup

- Copy `.env.e2e.example` → `.env.e2e` at the **repo root**.
- Backend: `make docker-e2e-up` (ord-api e2e stack, OTP `123456`).
- Journeys skip when `E2E_OTP_CODE` / `E2E_OTP_FETCH_URL` is missing.

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
// Multiple micro-tests for UI validation — use Vitest instead
test('submit button is disabled when email has no @ symbol', async ({ loginPage }) => { ... });

// API seed instead of user journey
const { id } = await seedConversationViaApi(page);
await conversationSessionPage.goto(id);

// Hardcoded email — breaks parallel workers
await loginPage.loginWithOtp(testEnv.testEmail);
```
