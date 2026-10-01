import { test, expect } from '@e2e/shared/fixtures/auth.fixture';
import { isE2eAuthConfigured } from '@e2e/shared/fixtures/test-env';
import { uniqueE2eWord } from '@e2e/shared/helpers/unique-e2e-word';
import { createCaptureWordsPopoverComponent, createWordsInboxPage } from '@e2e/words';

test.describe('Words capture fill AI journey', () => {
	test.beforeEach(() => {
		test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
	});

	test('add words via capture modal with Fill with AI and see them in the inbox list', async ({
		authenticatedPage
	}, testInfo) => {
		const sourceWord = uniqueE2eWord('fill', testInfo.workerIndex);
		const wordsInboxPage = createWordsInboxPage(authenticatedPage);
		const capturePopover = createCaptureWordsPopoverComponent(authenticatedPage);

		await test.step('01. Open words inbox', async () => {
			await wordsInboxPage.goto();
			await wordsInboxPage.expectLoaded();
		});

		await test.step('02. Capture word with Fill with AI and save', async () => {
			await capturePopover.openFromSidebar();
			await capturePopover.fillWord(0, sourceWord);
			await capturePopover.clickFillWithAi();
			await capturePopover.waitForFillComplete();
			await capturePopover.clickSave();
			await capturePopover.waitForClosed();
		});

		await test.step('03. Find word in inbox and open detail with TTS', async () => {
			await wordsInboxPage.search(sourceWord);
			await wordsInboxPage.expectWordVisible(sourceWord);
			await wordsInboxPage.openWordBySourceText(sourceWord);
			await wordsInboxPage.clickSourceWordTts();
			await expect(authenticatedPage).toHaveURL(new RegExp(`search=${sourceWord}`));
		});
	});
});
