import type { Page } from '@playwright/test';
import { test as pagesTest } from './pages.fixture';
import { isE2eAuthConfigured, testEnv } from './test-env';

type AuthFixtures = {
	/** Raw Playwright page already logged in via OTP flow. */
	authenticatedPage: Page;
};

export const test = pagesTest.extend<AuthFixtures>({
	authenticatedPage: async ({ page, loginPage }, use) => {
		if (!isE2eAuthConfigured()) {
			throw new Error(
				'E2E auth is not configured. Set E2E_OTP_CODE or E2E_OTP_FETCH_URL in .env.e2e'
			);
		}

		await loginPage.loginWithOtp(testEnv.testEmail);
		await use(page);
	}
});

export { expect } from '@playwright/test';
