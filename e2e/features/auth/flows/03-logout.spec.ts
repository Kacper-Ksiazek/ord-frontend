import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { createSidebarComponent } from '@e2e/app-layouts';
import { createConversationsListPage } from '@e2e/conversations/list';
import { getStoredUser } from '@e2e/shared/helpers/storage';

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
