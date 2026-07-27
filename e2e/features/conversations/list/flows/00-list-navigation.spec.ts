import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { seedConversationViaApi } from '@e2e/conversations';
import { createConversationsListPage } from '@e2e/conversations/list';
import { createCreateConversationPage } from '@e2e/conversations/create';
import { createConversationSessionPage } from '@e2e/conversations/session';

test.describe('Conversations list — loads', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('authenticated user sees heading, filters, and conversation rows', async ({
		authenticatedPage
	}) => {
		const { id } = await seedConversationViaApi(authenticatedPage);
		const conversationsListPage = createConversationsListPage(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();
		await conversationsListPage.expectFiltersVisible();
		await conversationsListPage.expectHasConversationRow(id);
	});
});

test.describe('Conversations list — navigate to create', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('new conversation button opens the create flow', async ({ authenticatedPage }) => {
		const conversationsListPage = createConversationsListPage(authenticatedPage);
		const createConversationPage = createCreateConversationPage(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();
		await conversationsListPage.clickNewConversation();

		await expect(authenticatedPage).toHaveURL(/\/conversations\/create/);
		await createConversationPage.expectLoaded();
	});
});

test.describe('Conversations list — open existing conversation', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('clicking a row opens the conversation session', async ({ authenticatedPage }) => {
		const { id } = await seedConversationViaApi(authenticatedPage);
		const conversationsListPage = createConversationsListPage(authenticatedPage);
		const conversationSessionPage = createConversationSessionPage(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();
		await conversationsListPage.openConversation(id);

		await expect(authenticatedPage).toHaveURL(new RegExp(`/conversations/${id}$`));
		await conversationSessionPage.expectLoaded();
	});
});
