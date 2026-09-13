import type { Page } from '@playwright/test';
import { test as pagesTest } from './pages.fixture';
import { isE2eAuthConfigured, workerEmail } from './test-env';
import { ensureE2eWorkerAccount } from '@e2e/shared/helpers/ensure-e2e-worker-account';
import { LoginPage } from '@e2e/auth';

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
		const email = workerEmail(testInfo.workerIndex);

		await loginPage.loginWithOtp(email);
		await ensureE2eWorkerAccount(page, testInfo.workerIndex);

		await use(page);
		await context.close();
	}
});

export { expect } from '@playwright/test';
