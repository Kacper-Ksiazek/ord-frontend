import { test } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { uniqueE2eWord } from '@e2e/shared/helpers/unique-e2e-word';
import { createWordWithAiFill, createWordsInboxPage } from '@e2e/words';

test.describe('Words generate manual journey', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('open a word from the inbox list and generate an AI manual in the detail panel', async ({
		authenticatedPage
	}, testInfo) => {
		const sourceWord = uniqueE2eWord('manual', testInfo.workerIndex);
		const wordsInboxPage = createWordsInboxPage(authenticatedPage);

		await test.step('01. Seed inbox word with AI fill helper', async () => {
			await createWordWithAiFill(authenticatedPage, sourceWord);
		});

		await test.step('02. Open word detail empty state', async () => {
			await wordsInboxPage.openWordBySourceText(sourceWord);
			await wordsInboxPage.expectDetailEmptyState();
		});

		await test.step('03. Generate manual with AI', async () => {
			await wordsInboxPage.clickGenerateManualWithAi();
			await wordsInboxPage.waitForGeneratedManual();
		});

		await test.step('04. Play source word and example sentence TTS', async () => {
			await wordsInboxPage.clickSourceWordTts();
			await wordsInboxPage.clickExampleSentenceTts(0);
		});
	});
});
