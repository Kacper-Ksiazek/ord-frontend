import type { Page } from '@playwright/test';
import { test as pagesTest } from './pages.fixture';
import { isE2eAuthConfigured, testEnv } from './test-env';
import { LoginPage } from '../pages/login.page';

type AuthFixtures = {
	/** Fresh Playwright page logged in via OTP for this test. */
	authenticatedPage: Page;
};

export const test = pagesTest.extend<AuthFixtures>({
	authenticatedPage: async ({ browser }, use, testInfo) => {
		if (!isE2eAuthConfigured()) {
			testInfo.skip(true, 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');

			return;
		}

		const context = await browser.newContext();
		const page = await context.newPage();
		const loginPage = new LoginPage(page);

		await loginPage.loginWithOtp(testEnv.testEmail);

		await use(page);
		await context.close();
	}
});

export { expect } from '@playwright/test';
