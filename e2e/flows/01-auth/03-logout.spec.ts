import { existsSync, unlinkSync } from 'node:fs';
import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured } from '../../fixtures/test-env';
import { AUTH_STORAGE_PATH } from '../../helpers/auth-storage';
import { getStoredUser } from '../../helpers/storage';
import { createConversationsListPage, createSidebarComponent } from '../../helpers/page-objects';

test.describe('Logout', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
		test.skip(!existsSync(AUTH_STORAGE_PATH), 'Auth storage missing — run login happy path first');
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

		// Server session is gone — drop stale cookies so later runs do not reuse them.
		if (existsSync(AUTH_STORAGE_PATH)) {
			unlinkSync(AUTH_STORAGE_PATH);
		}
	});
});
