import { test, expect } from '../../fixtures/auth.fixture';
import { getStoredUser } from '../../helpers/storage';
import { createConversationsListPage, createSidebarComponent } from '../../helpers/page-objects';

test.describe('Logout', () => {
	test('logout redirects to login and clears session', async ({ authenticatedPage }) => {
		const conversationsListPage = createConversationsListPage(authenticatedPage);
		const sidebar = createSidebarComponent(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();

		await sidebar.logout();

		await expect(authenticatedPage).toHaveURL(/\/login/);
		expect(await getStoredUser(authenticatedPage)).toBeNull();
	});

	test('cannot access private routes after logout', async ({ authenticatedPage }) => {
		const conversationsListPage = createConversationsListPage(authenticatedPage);
		const sidebar = createSidebarComponent(authenticatedPage);

		await conversationsListPage.goto();
		await sidebar.logout();

		await conversationsListPage.goto();
		await expect(authenticatedPage).toHaveURL(/\/login/);
	});
});
