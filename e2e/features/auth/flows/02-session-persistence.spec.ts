import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured, testEnv } from '@e2e/shared/fixtures/test-env';
import { LoginPage } from '@e2e/auth';
import { createConversationsListPage } from '@e2e/conversations/list';
import { getStoredUser } from '@e2e/shared/helpers/storage';

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
