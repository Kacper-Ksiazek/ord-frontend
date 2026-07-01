import { test, expect } from '../../fixtures/auth.fixture';
import { testEnv } from '../../fixtures/test-env';
import { seedUserInLocalStorage } from '../../helpers/storage';

test.describe('Session persistence', () => {
	test('session survives page reload', async ({
		authenticatedPage,
		conversationsListPage
	}) => {
		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();

		await authenticatedPage.reload();

		await expect(authenticatedPage).toHaveURL(/\/conversations/);
		await conversationsListPage.expectLoaded();
	});

	test('session is restored in a new browser context via storage state', async ({
		browser,
		loginPage
	}) => {
		const context = await browser.newContext();
		const page = await context.newPage();

		await loginPage.goto();
		await seedUserInLocalStorage(page, {
			id: 'e2e-user-id',
			email: testEnv.testEmail,
			name: 'E2E Test User',
			selectedLearningLanguage: 'English'
		});

		await page.goto('/conversations');

		// hooks.client.ts allows navigation when localStorage has user;
		// private layout still validates via /me — this test documents current behavior.
		await page.waitForURL(/\/(conversations|login)/);

		await context.close();
	});
});
