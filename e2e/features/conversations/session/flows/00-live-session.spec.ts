import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { seedConversationViaApi, waitForConversationMessageCount } from '@e2e/conversations';
import { createConversationsListPage } from '@e2e/conversations/list';
import { createConversationSessionPage } from '@e2e/conversations/session';

const USER_MESSAGE = 'Hello from E2E test';

test.describe('Live session — AI greeting on open', () => {
	test.describe.configure({ timeout: 90_000 });

	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('shows AI greeting after SSE init and enables the composer', async ({
		authenticatedPage
	}) => {
		const { id } = await seedConversationViaApi(authenticatedPage);
		const conversationSessionPage = createConversationSessionPage(authenticatedPage);

		await conversationSessionPage.goto(id);
		await conversationSessionPage.expectLoaded();
		await conversationSessionPage.waitForAiGreeting();
		await conversationSessionPage.expectComposerReady();
	});
});

test.describe('Live session — send message and receive AI reply', () => {
	test.describe.configure({ timeout: 90_000 });

	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('user message appears and AI replies via SSE stream', async ({ authenticatedPage }) => {
		const { id } = await seedConversationViaApi(authenticatedPage);
		const conversationSessionPage = createConversationSessionPage(authenticatedPage);

		await conversationSessionPage.goto(id);
		await conversationSessionPage.expectLoaded();
		await conversationSessionPage.waitForAiGreeting();
		await conversationSessionPage.expectComposerReady();

		await conversationSessionPage.sendMessage(USER_MESSAGE);
		await conversationSessionPage.waitForUserMessage(1);
		await conversationSessionPage.waitForAiReply(2);
	});
});

test.describe('Live session — resume conversation from list', () => {
	test.describe.configure({ timeout: 120_000 });

	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('reopening a conversation shows prior messages without duplicate AI init', async ({
		authenticatedPage
	}) => {
		const { id } = await seedConversationViaApi(authenticatedPage);
		const conversationSessionPage = createConversationSessionPage(authenticatedPage);
		const conversationsListPage = createConversationsListPage(authenticatedPage);

		await conversationSessionPage.goto(id);
		await conversationSessionPage.expectLoaded();
		await conversationSessionPage.waitForAiGreeting();
		await conversationSessionPage.sendMessage(USER_MESSAGE);
		await conversationSessionPage.waitForUserMessage(1);
		await conversationSessionPage.waitForAiReply(2);
		await waitForConversationMessageCount(authenticatedPage, id, 3);

		await conversationSessionPage.clickBack();
		await expect(authenticatedPage).toHaveURL(/\/conversations$/);
		await conversationsListPage.expectLoaded();

		await conversationsListPage.openConversation(id);
		await expect(authenticatedPage).toHaveURL(new RegExp(`/conversations/${id}$`));
		await conversationSessionPage.expectLoaded();
		await conversationSessionPage.waitForAiGreeting();
		await conversationSessionPage.waitForUserMessage(1);
		await conversationSessionPage.expectAiMessageCount(2);
	});
});

test.describe('Live session — back button returns to list', () => {
	test.describe.configure({ timeout: 90_000 });

	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('session back button navigates to conversations list', async ({ authenticatedPage }) => {
		const { id } = await seedConversationViaApi(authenticatedPage);
		const conversationSessionPage = createConversationSessionPage(authenticatedPage);
		const conversationsListPage = createConversationsListPage(authenticatedPage);

		await conversationSessionPage.goto(id);
		await conversationSessionPage.expectLoaded();
		await conversationSessionPage.waitForAiGreeting();

		await conversationSessionPage.clickBack();

		await expect(authenticatedPage).toHaveURL(/\/conversations$/);
		await conversationsListPage.expectLoaded();
	});
});
