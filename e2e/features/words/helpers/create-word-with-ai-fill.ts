import type { Page } from '@playwright/test';
import { createCaptureWordsPopoverComponent } from '../components/capture-words-popover.component';
import { createWordsInboxPage } from '../pages/words-inbox.page';

export async function createWordWithAiFill(page: Page, sourceWord: string): Promise<void> {
	const wordsInboxPage = createWordsInboxPage(page);
	const capturePopover = createCaptureWordsPopoverComponent(page);

	await wordsInboxPage.goto();
	await wordsInboxPage.expectLoaded();

	await capturePopover.openFromSidebar();
	await capturePopover.fillWord(0, sourceWord);
	await capturePopover.clickFillWithAi();
	await capturePopover.waitForFillComplete();
	await capturePopover.clickSave();
	await capturePopover.waitForClosed();

	await wordsInboxPage.search(sourceWord);
	await wordsInboxPage.expectWordVisible(sourceWord);
}
