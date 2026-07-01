import { test as base, type Page } from '@playwright/test';
import { loginViaOtp } from '../helpers/auth';
import { isE2eAuthConfigured, testEnv } from './test-env';

type AuthFixtures = {
	/** Page already logged in via OTP flow. */
	authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
	authenticatedPage: async ({ page }, use) => {
		if (!isE2eAuthConfigured()) {
			throw new Error(
				'E2E auth is not configured. Set E2E_OTP_CODE or E2E_OTP_FETCH_URL in .env.e2e'
			);
		}

		await loginViaOtp(page, testEnv.testEmail);
		await use(page);
	}
});

export { expect } from '@playwright/test';
