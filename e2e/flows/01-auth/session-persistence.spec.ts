import { test, expect } from '../../fixtures/auth.fixture';
import { testEnv } from '../../fixtures/test-env';
import { createConversationsListPage } from '../../helpers/page-objects';

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
		page,
		loginPage
	}) => {
		await loginPage.loginWithOtp(testEnv.testEmail);

		const storageState = await page.context().storageState();
		const newContext = await browser.newContext({ storageState });
		const newPage = await newContext.newPage();
		const conversationsListPage = createConversationsListPage(newPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();

		await newContext.close();
	});
});
