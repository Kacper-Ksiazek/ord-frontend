import { test, expect } from '../../fixtures/auth.fixture';
import { isE2eAuthConfigured } from '../../fixtures/test-env';
import {
	createConversationSessionPage,
	createCreateConversationPage
} from '../../helpers/page-objects';

test.describe('Create conversation — full happy path', () => {
	test.describe.configure({ timeout: 90_000 });

	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('completes all steps and opens the new session', async ({ authenticatedPage }) => {
		const createConversationPage = createCreateConversationPage(authenticatedPage);
		const conversationSessionPage = createConversationSessionPage(authenticatedPage);

		await createConversationPage.gotoFresh();
		await createConversationPage.completeTypeToneTopicSteps();
		await createConversationPage.startConversationAndWaitForSession();

		await conversationSessionPage.expectLoaded();
	});
});

test.describe('Create conversation — step validation blocks advance', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('next stays disabled until type, tone, and topic are selected', async ({
		authenticatedPage
	}) => {
		const createConversationPage = createCreateConversationPage(authenticatedPage);

		await createConversationPage.gotoFresh();

		await createConversationPage.expectStepVisible('type');
		await createConversationPage.expectNextDisabled();
		await createConversationPage.selectType('SMALL_TALK');
		await createConversationPage.expectNextEnabled();
		await createConversationPage.clickNext();

		await createConversationPage.expectStepVisible('tone');
		await createConversationPage.expectNextDisabled();
		await createConversationPage.selectTone('FRIENDLY');
		await createConversationPage.expectNextEnabled();
		await createConversationPage.clickNext();

		await createConversationPage.expectStepVisible('topic');
		await createConversationPage.expectNextDisabled();
		await createConversationPage.selectTopicRow(0);
		await createConversationPage.expectNextEnabled();
		await createConversationPage.clickNext();

		await createConversationPage.expectStepVisible('summary');
		await expect(createConversationPage.startButton).toBeVisible();
	});
});

test.describe('Create conversation — back navigation preserves selections', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('previous returns through steps with selections intact and start still works', async ({
		authenticatedPage
	}) => {
		const createConversationPage = createCreateConversationPage(authenticatedPage);
		const conversationSessionPage = createConversationSessionPage(authenticatedPage);

		await createConversationPage.gotoFresh();
		await createConversationPage.completeTypeToneTopicSteps();

		await createConversationPage.clickPrevious();
		await createConversationPage.expectStepVisible('topic');
		await createConversationPage.expectNextEnabled();

		await createConversationPage.clickPrevious();
		await createConversationPage.expectStepVisible('tone');
		await createConversationPage.expectNextEnabled();

		await createConversationPage.clickPrevious();
		await createConversationPage.expectStepVisible('type');
		await createConversationPage.expectNextEnabled();

		await createConversationPage.clickNext();
		await createConversationPage.expectStepVisible('tone');
		await createConversationPage.expectNextEnabled();
		await createConversationPage.clickNext();

		await createConversationPage.expectStepVisible('topic');
		await createConversationPage.expectNextEnabled();
		await createConversationPage.clickNext();

		await createConversationPage.expectStepVisible('summary');
		await createConversationPage.startConversationAndWaitForSession();
		await conversationSessionPage.expectLoaded();
	});
});
