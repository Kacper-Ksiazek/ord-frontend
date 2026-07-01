import type { Page } from '@playwright/test';
import { test as pagesTest } from './pages.fixture';
import { isE2eAuthConfigured, testEnv } from './test-env';

type AuthFixtures = {
	/** Raw Playwright page already logged in via OTP flow. */
	authenticatedPage: Page;
};

export const test = pagesTest.extend<AuthFixtures>({
	authenticatedPage: async ({ page, loginPage }, use, testInfo) => {
		if (!isE2eAuthConfigured()) {
			testInfo.skip(true, 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
			return;
		}

		await loginPage.loginWithOtp(testEnv.testEmail);
		await use(page);
	}
});

export { expect } from '@playwright/test';
