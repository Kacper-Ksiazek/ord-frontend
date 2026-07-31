import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { seedConversationsViaApi } from '@e2e/conversations';
import { createConversationsListPage } from '@e2e/conversations/list';

test.describe('Conversations list — filter by search and type', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('applies search and type filters and updates the URL', async ({ authenticatedPage }) => {
		const [smallTalk, topicExploration] = await seedConversationsViaApi(authenticatedPage, [
			{ type: 'SMALL_TALK', topic: 'E2E Alpha small talk filter' },
			{ type: 'TOPIC_EXPLORATION', topic: 'E2E Beta topic exploration filter' }
		]);
		const conversationsListPage = createConversationsListPage(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();
		await conversationsListPage.expectConversationRowCount(2);

		await conversationsListPage.fillSearchFilter('Alpha');
		await conversationsListPage.selectTypeFilter('SMALL_TALK');

		await conversationsListPage.expectUrlFilters({
			search: 'Alpha',
			type: 'SMALL_TALK'
		});
		await conversationsListPage.expectConversationRowCount(1);
		await conversationsListPage.expectHasConversationRow(smallTalk.id);
		await expect(conversationsListPage.conversationRow(topicExploration.id)).toHaveCount(0);
	});
});

test.describe('Conversations list — no matches shows clear-filters CTA', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('empty filter results can be cleared to restore the list', async ({ authenticatedPage }) => {
		const [{ id }] = await seedConversationsViaApi(authenticatedPage, [
			{ type: 'SMALL_TALK', topic: 'E2E clear filters seed' }
		]);
		const conversationsListPage = createConversationsListPage(authenticatedPage);

		await conversationsListPage.goto();
		await conversationsListPage.expectLoaded();
		await conversationsListPage.expectHasConversationRow(id);

		await conversationsListPage.fillSearchFilter('zzznomatchzzz');
		await conversationsListPage.expectNoMatchesState();

		await conversationsListPage.clickNoMatchesClearFilters();
		await conversationsListPage.expectUrlFilters({ search: '' });
		await conversationsListPage.expectHasConversationRow(id);
	});
});
