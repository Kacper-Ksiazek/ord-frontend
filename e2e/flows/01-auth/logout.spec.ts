import { test, expect } from '../../fixtures/auth.fixture';
import { logoutViaSidebar } from '../../helpers/auth';

const USER_STORAGE_KEY = 'ord_app_user';

test.describe('Logout', () => {
	test('logout redirects to login and clears session', async ({ authenticatedPage }) => {
		await authenticatedPage.goto('/conversations');
		await expect(authenticatedPage.getByRole('heading', { name: 'Conversations' })).toBeVisible();

		await logoutViaSidebar(authenticatedPage);

		await expect(authenticatedPage).toHaveURL(/\/login/);

		const storedUser = await authenticatedPage.evaluate(
			(key) => localStorage.getItem(key),
			USER_STORAGE_KEY
		);
		expect(storedUser).toBeNull();
	});

	test('cannot access private routes after logout', async ({ authenticatedPage }) => {
		await authenticatedPage.goto('/conversations');
		await logoutViaSidebar(authenticatedPage);

		await authenticatedPage.goto('/conversations');
		await expect(authenticatedPage).toHaveURL(/\/login/);
	});
});
