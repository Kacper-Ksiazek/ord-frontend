import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { createConversationsListPage } from '@e2e/conversations/list';
import { createExplainPhrasePopoverComponent } from '@e2e/ai-explainer';

const LIST_SEARCH_FILTER = 'e2e-explain';
const EXPLAIN_PHRASE = 'audacity';

test.describe('Explain phrase journey', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('open and close explain modal from sidebar and deep link, then explain an English phrase', async ({
		authenticatedPage
	}) => {
		const conversationsListPage = createConversationsListPage(authenticatedPage);
		const explainPopover = createExplainPhrasePopoverComponent(authenticatedPage);

		await test.step('01. Load conversations list and set search filter', async () => {
			await conversationsListPage.goto();
			await conversationsListPage.expectLoaded();
			await conversationsListPage.fillSearchFilter(LIST_SEARCH_FILTER);
			await expect(conversationsListPage.filterSearch).toHaveValue(LIST_SEARCH_FILTER);
		});

		await test.step('02. Open explain modal from sidebar', async () => {
			await explainPopover.openFromSidebar();
			await explainPopover.expectAnswerTabDisabled();
			expect(new URL(authenticatedPage.url()).searchParams.get('search')).toBe(LIST_SEARCH_FILTER);
		});

		await test.step('03. Close modal without clearing list filters', async () => {
			await explainPopover.clickClose();
			await explainPopover.expectClosed();
			await explainPopover.expectModalInUrl(false);
			await conversationsListPage.expectUrlFilters({ search: LIST_SEARCH_FILTER });
			await expect(conversationsListPage.filterSearch).toHaveValue(LIST_SEARCH_FILTER);
		});

		await test.step('04. Open modal from deep link', async () => {
			await authenticatedPage.goto(`/conversations?search=${LIST_SEARCH_FILTER}&modal=explain`);
			await conversationsListPage.expectLoaded();
			await explainPopover.expectOpen();
			await explainPopover.expectModalInUrl(true);
			await conversationsListPage.expectUrlFilters({ search: LIST_SEARCH_FILTER });
			await expect(conversationsListPage.filterSearch).toHaveValue(LIST_SEARCH_FILTER);
		});

		await test.step('05. Explain English phrase audacity', async () => {
			await explainPopover.fillPhrase(EXPLAIN_PHRASE);

			const requestBody = await explainPopover.clickExplainAndWaitForResponse();
			expect(requestBody).toMatchObject({
				phrase: EXPLAIN_PHRASE,
				language: 'ENGLISH',
				context: null,
				customInstruction: null
			});

			await explainPopover.waitForExplanationComplete();
			await explainPopover.expectModalInUrl(true);
			await conversationsListPage.expectUrlFilters({ search: LIST_SEARCH_FILTER });
		});

		await test.step('06. Follow up with more examples', async () => {
			const followUpBody = await explainPopover.clickFollowUpAndWaitForResponse('MORE_EXAMPLES');
			expect(followUpBody).toMatchObject({
				phrase: EXPLAIN_PHRASE,
				language: 'ENGLISH',
				action: 'MORE_EXAMPLES'
			});
			expect(followUpBody.previousExplanation.trim().length).toBeGreaterThan(0);

			await explainPopover.waitForMoreExamplesSkeletonHidden();
			await explainPopover.expectMoreExamplesVisible();
		});

		await test.step('07. Follow up with simpler definition', async () => {
			const followUpBody = await explainPopover.clickFollowUpAndWaitForResponse('SIMPLER');
			expect(followUpBody).toMatchObject({
				phrase: EXPLAIN_PHRASE,
				language: 'ENGLISH',
				action: 'SIMPLER'
			});
			expect(followUpBody.previousExplanation.trim().length).toBeGreaterThan(0);

			await explainPopover.expectSimplerDefinitionVisible();
		});

		await test.step('08. Follow up with similar expressions', async () => {
			const followUpBody = await explainPopover.clickFollowUpAndWaitForResponse('SIMILAR_EXPRESSIONS');
			expect(followUpBody).toMatchObject({
				phrase: EXPLAIN_PHRASE,
				language: 'ENGLISH',
				action: 'SIMILAR_EXPRESSIONS'
			});

			await explainPopover.expectSimilarExpressionsVisible();
		});

		await test.step('09. Clear explainer state from request tab', async () => {
			await explainPopover.clickRequestTab();
			await explainPopover.clickClearAll();
			await explainPopover.expectAnswerTabDisabled();
		});

		await test.step('10. Advanced form context and instruction fields are editable', async () => {
			await explainPopover.toggleAdvancedForm();
			await explainPopover.expectAdvancedFormFieldsEditable();
		});
	});
});
