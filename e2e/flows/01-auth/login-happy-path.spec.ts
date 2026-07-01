import { test, expect } from '@playwright/test';
import { isE2eAuthConfigured, testEnv } from '../../fixtures/test-env';
import { loginViaOtp } from '../../helpers/auth';
import { loginSelectors, sidebarSelectors } from '../../helpers/selectors';

test.describe('Login — happy path', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('unauthenticated user is redirected to login, then can access conversations', async ({
		page
	}) => {
		await page.goto('/conversations');
		await expect(page).toHaveURL(/\/login/);

		await loginViaOtp(page, testEnv.testEmail);

		await page.goto('/conversations');
		await expect(page).toHaveURL(/\/conversations/);
		await expect(page.getByRole('heading', { name: 'Conversations' })).toBeVisible();
	});

	test('after login sidebar shows user email', async ({ page }) => {
		await loginViaOtp(page, testEnv.testEmail);
		await page.goto('/conversations');

		await expect(page.locator(sidebarSelectors.userEmail)).toContainText(testEnv.testEmail);
	});
});
