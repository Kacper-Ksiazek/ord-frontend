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
	// Use the built-in `page` fixture so Playwright records video/trace for journeys 01–04.
	// Manual `browser.newContext()` is not linked to the test runner's artifact pipeline.
	authenticatedPage: [
		async ({ page }, use, testInfo) => {
			if (!isE2eAuthConfigured()) {
				testInfo.skip(true, 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');

				return;
			}

			const loginPage = new LoginPage(page);
			const email = workerEmail(testInfo.workerIndex);

			await loginPage.loginWithOtp(email);
			await ensureE2eWorkerAccount(page, testInfo.workerIndex);

			await use(page);
		},
		{ timeout: 90_000 }
	]
});

export { expect } from '@playwright/test';
