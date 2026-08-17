import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { emailForWorker, isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { createSidebarComponent } from '@e2e/app-layouts';
import { createConversationsListPage } from '@e2e/conversations/list';

test.describe('Auth journey', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('login, access app, logout, and block private routes', async ({
		page,
		loginPage
	}, testInfo) => {
		const email = emailForWorker(testInfo.workerIndex);
		const conversationsListPage = createConversationsListPage(page);
		const sidebar = createSidebarComponent(page);

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/login/);

		await loginPage.loginWithOtp(email);

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/conversations/);
		await conversationsListPage.expectLoaded();
		await sidebar.expectUserEmailVisible(email);

		await sidebar.logout();
		await expect(page).toHaveURL(/\/login/);

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/login/);
	});
});
