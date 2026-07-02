import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured, testEnv } from '../../fixtures/test-env';
import { createConversationsListPage } from '../../helpers/page-objects';
import { getStoredUser } from '../../helpers/storage';
import { LoginPage } from '../../pages/login.page';

test.describe('Session persistence', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('session survives page reload', async ({ authenticatedPage }) => {
		const conversationsListPage = createConversationsListPage(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();

		await authenticatedPage.reload();

		await expect(authenticatedPage).toHaveURL(/\/conversations/);
		await conversationsListPage.expectLoaded();
	});

	test('session is restored in a new browser context via storage state', async ({ browser }) => {
		const sourceContext = await browser.newContext();
		const sourcePage = await sourceContext.newPage();

		await new LoginPage(sourcePage).loginWithOtp(testEnv.testEmail);
		const storageState = await sourceContext.storageState();
		await sourceContext.close();

		const newContext = await browser.newContext({ storageState });
		const newPage = await newContext.newPage();
		const conversationsListPage = createConversationsListPage(newPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();
		expect(await getStoredUser(newPage)).not.toBeNull();

		await newContext.close();
	});
});
