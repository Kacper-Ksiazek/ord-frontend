# E2E tests: Playwright with page objects

E2E tests live in `e2e/` with their own config (`e2e/playwright.config.ts`) and a strict page-object structure: specs in `e2e/flows/<nn-area>/<nn-name>.spec.ts`, page objects in `e2e/pages/` (shared UI parts in `e2e/pages/components/`), fixtures in `e2e/fixtures/`, and utilities in `e2e/helpers/`. Specs import `test`/`expect` from a fixture (not directly from `@playwright/test`) so page objects are injected, and page objects locate elements via `getByTestId` with ids from `e2e/helpers/test-ids.ts`. Run with `bun run test:e2e`.

## Local setup

- Copy `.env.e2e.example` → `.env.e2e` at the **repo root** (not under `e2e/`).
- Backend: `ord-api` stack via `docker compose -f docker-compose.e2e.yml up --wait` (profile `e2e`, OTP whitelist `e2e-ci@ord.test` / `123456`).
- Playwright uses `workers: 1` — parallel logins for the same user invalidate sessions on the backend.
- Auth specs skip (do not fail) when `E2E_OTP_CODE` / `E2E_OTP_FETCH_URL` is missing — use `test.beforeEach` skip guards on OTP-dependent describes.

## CI

- Workflow: `.github/workflows/e2e.yml` — job name **`e2e`**, **blocking** on PRs.
- Backend image is pinned: `.github/ord-api-e2e-image.sha` → `ghcr.io/kacper-ksiazek/ord-api:sha-<commit>` (not `latest`).
- When changing the `ord-api` E2E profile, OTP whitelist, or health-check contract, bump the pin file after the image is published.
- Required-check setup: `.github/REQUIRED_CHECKS.md`.

## Good

```ts
// e2e/flows/01-auth/00-login-happy-path.spec.ts
import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured, testEnv } from '../../fixtures/test-env';

test.describe('Login — happy path', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('unauthenticated user is redirected to login', async ({
		page,
		loginPage,
		conversationsListPage
	}) => {
		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/login/);

		await loginPage.loginWithOtp(testEnv.testEmail);
		await conversationsListPage.expectLoaded();
	});
});
```

```ts
// e2e/pages/login.page.ts — page object with testid-based locators
export class LoginPage {
	readonly emailInput: Locator;

	constructor(protected readonly page: Page) {
		this.emailInput = page.getByTestId(E2E_TEST_IDS.login.emailInput);
	}

	async waitForLoginSuccess(): Promise<void> {
		// After OTP, app lands on /conversations (via / redirect).
		await this.page.waitForURL((url) => url.pathname === '/conversations' || url.pathname === '/', {
			timeout: 15_000
		});
	}
}
```

## Bad

```ts
// e2e/login.spec.ts — spec outside flows/, raw @playwright/test, inline CSS selectors
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
