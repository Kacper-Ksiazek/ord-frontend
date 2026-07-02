import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured } from '../../fixtures/test-env';
import { getStoredUser } from '../../helpers/storage';
import { createConversationsListPage, createSidebarComponent } from '../../helpers/page-objects';

test.describe('Logout', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('logout clears session and blocks private routes', async ({ authenticatedPage }) => {
		const conversationsListPage = createConversationsListPage(authenticatedPage);
		const sidebar = createSidebarComponent(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();

		await sidebar.logout();

		await expect(authenticatedPage).toHaveURL(/\/login/);
		expect(await getStoredUser(authenticatedPage)).toBeNull();

		await conversationsListPage.goto();
		await expect(authenticatedPage).toHaveURL(/\/login/);
	});
});
