import type { Page } from '@playwright/test';
import { test as pagesTest } from './pages.fixture';
import { isE2eAuthConfigured } from './test-env';
import { resolveAuthStoragePath } from '../helpers/auth-storage';

type AuthFixtures = {
	/** Raw Playwright page already logged in via OTP flow. */
	authenticatedPage: Page;
};

export const test = pagesTest.extend<AuthFixtures>({
	authenticatedPage: async ({ browser }, use, testInfo) => {
		if (!isE2eAuthConfigured()) {
			testInfo.skip(true, 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
			return;
		}

		const storagePath = await resolveAuthStoragePath(browser);
		const context = await browser.newContext({ storageState: storagePath });
		const page = await context.newPage();

		await use(page);
		await context.close();
	}
});

export { expect } from '@playwright/test';
