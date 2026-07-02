import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured } from '../../fixtures/test-env';
import { AUTH_STORAGE_PATH } from '../../helpers/auth-storage';
import { createConversationsListPage } from '../../helpers/page-objects';
import { existsSync } from 'node:fs';

test.describe('Session persistence', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
		test.skip(!existsSync(AUTH_STORAGE_PATH), 'Auth storage missing — run login happy path first');
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
		const newContext = await browser.newContext({ storageState: AUTH_STORAGE_PATH });
		const newPage = await newContext.newPage();
		const conversationsListPage = createConversationsListPage(newPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();

		await newContext.close();
	});
});
