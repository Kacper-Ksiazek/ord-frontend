import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { createConversationSessionPage } from '@e2e/conversations/session';
import { createCreateConversationPage } from '@e2e/conversations/create';
import { createConversationsListPage } from '@e2e/conversations/list';

const USER_MESSAGE = 'Hello from E2E resume journey';

test.describe('Resume conversation journey', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('reopening a conversation from the list shows persisted messages', async ({
		authenticatedPage
	}) => {
		const conversationsListPage = createConversationsListPage(authenticatedPage);
		const createConversationPage = createCreateConversationPage(authenticatedPage);
		const conversationSessionPage = createConversationSessionPage(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();
		await conversationsListPage.clickNewConversation();
		await expect(authenticatedPage).toHaveURL(/\/conversations\/create/);

		await createConversationPage.clearStoredDefaults();
		await createConversationPage.goto();
		await createConversationPage.expectLoaded();
		await createConversationPage.expectStepVisible('type');
		await createConversationPage.completeTypeToneTopicSteps();
		await createConversationPage.startConversationAndWaitForSession();

		await conversationSessionPage.expectLoaded();
		await conversationSessionPage.waitForAiGreeting();
		await conversationSessionPage.expectComposerReady();
		await conversationSessionPage.sendMessage(USER_MESSAGE);
		await conversationSessionPage.waitForUserMessage(1);
		await conversationSessionPage.waitForAiReply(2);

		const conversationId = new URL(authenticatedPage.url()).pathname.split('/').pop();
		expect(conversationId).toBeTruthy();
		if (!conversationId) {
			throw new Error('Expected conversation id in session URL');
		}

		await conversationSessionPage.clickBack();
		await expect(authenticatedPage).toHaveURL(/\/conversations$/);
		await conversationsListPage.expectLoaded();

		await conversationsListPage.openConversation(conversationId);
		await expect(authenticatedPage).toHaveURL(new RegExp(`/conversations/${conversationId}$`));
		await conversationSessionPage.expectLoaded();
		await conversationSessionPage.waitForAiGreeting();
		await conversationSessionPage.waitForUserMessage(1);
		await conversationSessionPage.expectAiMessageCount(2);
	});
});
