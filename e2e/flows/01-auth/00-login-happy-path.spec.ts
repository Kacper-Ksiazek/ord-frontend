import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured, testEnv } from '../../fixtures/test-env';
import { createConversationsListPage, createSidebarComponent } from '../../helpers/page-objects';

test.describe('Login — happy path', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('unauthenticated user is redirected to login, then can access conversations', async ({
		page,
		loginPage,
		conversationsListPage
	}) => {
		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/login/);

		await loginPage.loginWithOtp(testEnv.testEmail);

		await conversationsListPage.goto();
		await expect(page).toHaveURL(/\/conversations/);
		await conversationsListPage.expectLoaded();
	});

	test('after login sidebar shows user email', async ({ authenticatedPage }) => {
		const conversationsListPage = createConversationsListPage(authenticatedPage);
		const sidebar = createSidebarComponent(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();

		await sidebar.expectUserEmailVisible(testEnv.testEmail);
	});
});
