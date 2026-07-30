# E2E tests: Playwright with page objects (FDD layout)

E2E tests live in `e2e/` with their own config (`e2e/playwright.config.ts`) and **feature-aligned** layout mirroring `src/lib/features/`:

- **Specs:** `e2e/features/<feature>/…/flows/*.spec.ts` (and sub-pages for conversations: `list/`, `create/`, `session/`)
- **Page objects:** co-located under each feature module (`pages/`, `components/`)
- **Shared kernel:** `e2e/shared/` — fixtures, env, API client, test-id re-export (cross-feature only)
- **Types:** `e2e/tsconfig.json` — Playwright globals, `@e2e/*` and `$lib/*` path aliases; run `bun run check:e2e`

Specs import `test`/`expect` from `@e2e/shared/fixtures/*` (not directly from `@playwright/test`). **`pages.fixture`** injects only `loginPage`; other page objects use **factory functions** exported from each feature barrel (`@e2e/auth`, `@e2e/conversations/list`, …). Page objects locate elements via `getByTestId` with ids from `@e2e/shared/helpers/test-ids`. Run with `make test-e2e`.

**Scenario registry:** when adding or changing a spec, follow `testing/e2e-scenario-registry.md` — update `e2e/docs/scenarios/<feature>/…` and the index in the **same PR** as the spec. Strategic backlog stays in `docs/e2e-test-plan.md`.

**App bugs:** if a flow fails unless you work around product behavior, stop and notify the developer — see `testing/e2e-app-bugs-block-tests.md`. Do not ship specs that pass only via reload, cache bust, or other bypasses.

## Directory layout

```
e2e/
├── playwright.config.ts
├── tsconfig.json
├── shared/
│   ├── fixtures/          # auth.fixture, pages.fixture, test-env
│   └── helpers/           # api-client, otp, storage, test-ids
├── features/
│   ├── auth/
│   │   ├── flows/
│   │   └── pages/
│   ├── app-layouts/
│   │   └── components/    # SidebarComponent
│   └── conversations/
│       ├── list/          # flows + pages
│       ├── create/
│       ├── session/
│       └── helpers/       # seedConversationViaApi (feature-shared)
└── docs/scenarios/        # mirrors features/ (not flows/)
```

**Import rules:** feature E2E code imports from its own module or `@e2e/shared/*`. Cross-feature specs (e.g. session → list) import **public barrels** only (`@e2e/conversations/list`), never deep paths into another feature's internals.

## Local setup

- Copy `.env.e2e.example` → `.env.e2e` at the **repo root** (not under `e2e/`).
- Backend: `ord-api` stack via `docker compose -f docker-compose.e2e.yml up --wait` (profile `e2e`, OTP whitelist `e2e-ci@ord.test` / `123456`).
- Playwright uses `workers: 1` — parallel logins for the same user invalidate sessions on the backend.
- Auth specs skip (do not fail) when `E2E_OTP_CODE` / `E2E_OTP_FETCH_URL` is missing — use `test.beforeEach` skip guards on OTP-dependent describes.

## CI

- Workflow: `.github/workflows/e2e.yml` — job name **`e2e`**, **blocking** on PRs.
- Typecheck: `bun run check:e2e` (`e2e-types` job in `ci.yml`).
- Backend image is pinned: `.github/ord-api-e2e-image.sha` → `ghcr.io/kacper-ksiazek/ord-api:sha-<commit>` (not `latest`).
- When changing the `ord-api` E2E profile, OTP whitelist, or health-check contract, bump the pin file after the image is published.
- Required-check setup: `.github/REQUIRED_CHECKS.md`.

## Good

```ts
// e2e/features/auth/flows/00-login-happy-path.spec.ts
import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured, testEnv } from '@e2e/shared/fixtures/test-env';
import { createConversationsListPage } from '@e2e/conversations/list';

test.describe('Login — happy path', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('unauthenticated user is redirected to login', async ({ page, loginPage }) => {
		const conversationsListPage = createConversationsListPage(page);

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/login/);

		await loginPage.loginWithOtp(testEnv.testEmail);
		await conversationsListPage.expectLoaded();
	});
});
```

```ts
// e2e/features/auth/pages/login.page.ts — page object with testid-based locators
export class LoginPage {
	readonly emailInput: Locator;

	constructor(protected readonly page: Page) {
		this.emailInput = page.getByTestId(E2E_TEST_IDS.login.emailInput);
	}

	async waitForLoginSuccess(): Promise<void> {
		await this.page.waitForURL((url) => url.pathname === '/conversations' || url.pathname === '/', {
			timeout: 15_000
		});
	}
}

export function createLoginPage(page: Page): LoginPage {
	return new LoginPage(page);
}
```

## Bad

```ts
// e2e/login.spec.ts — spec outside features/, raw @playwright/test, inline CSS selectors
import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
	await page.goto('http://localhost:5173/login');
	await page.locator('input.email-field').fill('user@example.com');
	await page.locator('button:has-text("Submit")').click();
	await page.waitForTimeout(3000);
	expect(page.url()).toContain('/');
});
```

```yaml
# .github/workflows/e2e.yml — pulling :latest, no pin file
- run: docker compose -f ord-api/docker-compose.e2e.yml up -d --wait
  # ORD_API_IMAGE defaults to :latest — non-reproducible across CI runs
```
