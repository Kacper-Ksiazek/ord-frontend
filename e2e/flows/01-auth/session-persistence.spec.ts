import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured, testEnv } from '../../fixtures/test-env';
import { ConversationsListPage } from '../../pages';

test.describe('Session persistence', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

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
		const conversationsListPage = new ConversationsListPage(newPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();

		await newContext.close();
	});
});
