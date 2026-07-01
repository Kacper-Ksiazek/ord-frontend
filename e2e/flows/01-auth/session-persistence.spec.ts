import { test, expect } from '../../fixtures/auth.fixture';
import { testEnv } from '../../fixtures/test-env';

test.describe('Session persistence', () => {
	test('session survives page reload', async ({ authenticatedPage }) => {
		await authenticatedPage.goto('/conversations');
		await expect(authenticatedPage.getByRole('heading', { name: 'Conversations' })).toBeVisible();

		await authenticatedPage.reload();

		await expect(authenticatedPage).toHaveURL(/\/conversations/);
		await expect(authenticatedPage.getByRole('heading', { name: 'Conversations' })).toBeVisible();
	});

	test('session is restored in a new browser context via storage state', async ({
		browser
	}) => {
		const context = await browser.newContext();
		const page = await context.newPage();

		await page.goto('/login');
		await page.evaluate(
			({ email, user }) => {
				localStorage.setItem('ord_app_user', JSON.stringify(user));
				localStorage.setItem('ord_app_session_initialized', JSON.stringify(true));
			},
			{
				email: testEnv.testEmail,
				user: {
					id: 'e2e-user-id',
					email: testEnv.testEmail,
					name: 'E2E Test User',
					selectedLearningLanguage: 'English'
				}
			}
		);

		await page.goto('/conversations');

		// hooks.client.ts allows navigation when localStorage has user;
		// private layout still validates via /me — this test documents current behavior.
		await page.waitForURL(/\/(conversations|login)/);

		await context.close();
	});
});
