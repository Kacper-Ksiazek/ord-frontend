# E2E tests: Playwright with page objects

E2E tests live in `e2e/` with their own config (`e2e/playwright.config.ts`) and a strict page-object structure: specs in `e2e/flows/<nn-area>/<nn-name>.spec.ts`, page objects in `e2e/pages/` (shared UI parts in `e2e/pages/components/`), fixtures in `e2e/fixtures/`, and utilities in `e2e/helpers/`. Specs import `test`/`expect` from a fixture (not directly from `@playwright/test`) so page objects are injected, and page objects locate elements via `getByTestId` with ids from `e2e/helpers/test-ids.ts`. Run with `bun run test:e2e`.

## Good

```ts
// e2e/flows/01-auth/00-login-happy-path.spec.ts
import { test, expect } from '../../fixtures/auth.fixture';
import { testEnv } from '../../fixtures/test-env';

test.describe('Login — happy path', () => {
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

	async goto(): Promise<void> {
		await this.page.goto('/login');
		await this.emailInput.waitFor();
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
