import { test } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { createCreateConversationPage } from '@e2e/conversations/create';

test.describe('Create conversation — AI topic suggestions', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('generates topic rows and allows proceeding after selection', async ({
		authenticatedPage
	}) => {
		const createConversationPage = createCreateConversationPage(authenticatedPage);

		await createConversationPage.gotoFresh();
		await createConversationPage.selectType('TOPIC_EXPLORATION');
		await createConversationPage.clickNext();

		await createConversationPage.expectStepVisible('tone');
		await createConversationPage.selectTone('FRIENDLY');
		await createConversationPage.clickNext();

		await createConversationPage.expectStepVisible('topic');
		await createConversationPage.expectNextDisabled();
		await createConversationPage.clickGenerateTopics();
		await createConversationPage.waitForTopicRow(0);
		await createConversationPage.selectTopicRow(0);
		await createConversationPage.expectNextEnabled();
		await createConversationPage.clickNext();

		await createConversationPage.expectStepVisible('summary');
	});
});
