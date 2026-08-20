import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { createConversationSessionPage } from '@e2e/conversations/session';
import { createCreateConversationPage } from '@e2e/conversations/create';
import { createConversationsListPage } from '@e2e/conversations/list';

const USER_MESSAGE = 'Hello from E2E journey';

test.describe('Core flow journey', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('create conversation via UI and exchange messages in live session', async ({
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
	});
});
