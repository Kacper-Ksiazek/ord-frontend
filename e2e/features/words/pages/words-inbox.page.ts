import { expect, type Locator, type Page } from '@playwright/test';
import { E2E_TEST_IDS } from '@e2e/words/test-ids';
import { E2E_TEST_IDS as APP_LAYOUTS_E2E_TEST_IDS } from '@e2e/app-layouts/test-ids';
import { clickTtsAndWaitForSpeak } from '@e2e/shared/helpers/click-tts';

export class WordsInboxPage {
	readonly path = '/words';

	readonly heading: Locator;
	readonly list: Locator;
	readonly detailPanel: Locator;
	readonly filterSearch: Locator;

	constructor(protected readonly page: Page) {
		this.heading = page.getByTestId(E2E_TEST_IDS.inbox.heading);
		this.list = page.getByTestId(E2E_TEST_IDS.inbox.root);
		this.detailPanel = page.getByTestId(E2E_TEST_IDS.inbox.detailPanel);
		this.filterSearch = page.getByTestId(E2E_TEST_IDS.inbox.filterSearch);
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}

	async expectLoaded(): Promise<void> {
		await this.page.getByTestId(APP_LAYOUTS_E2E_TEST_IDS.sidebar.root).waitFor({ state: 'visible' });
		await this.page.getByTestId(E2E_TEST_IDS.inbox.page).waitFor({ state: 'visible' });
		await this.heading.waitFor({ state: 'visible' });
	}

	async search(sourceWord: string): Promise<void> {
		await this.filterSearch.fill(sourceWord);
		await expect
			.poll(() => new URL(this.page.url()).searchParams.get('search'), { timeout: 8_000 })
			.toBe(sourceWord);
	}

	async expectWordVisible(sourceWord: string): Promise<void> {
		await expect(this.list.getByText(sourceWord, { exact: true })).toBeVisible({ timeout: 15_000 });
	}

	async openWordBySourceText(sourceWord: string): Promise<void> {
		await this.list.getByRole('button').filter({ hasText: sourceWord }).click();
		await this.expectDetailPanelOpen();
	}

	async expectDetailPanelOpen(): Promise<void> {
		await this.detailPanel.waitFor({ state: 'visible' });
	}

	async expectDetailEmptyState(): Promise<void> {
		await this.page.getByTestId(E2E_TEST_IDS.inbox.detailEmptyState).waitFor({ state: 'visible' });
	}

	async clickGenerateManualWithAi(): Promise<void> {
		await this.page.getByTestId(E2E_TEST_IDS.inbox.detailGenerateWithAi).click();
	}

	async waitForGeneratedManual(): Promise<void> {
		await expect(this.page.getByTestId(E2E_TEST_IDS.inbox.detailAiSkeleton)).toBeHidden({
			timeout: 45_000
		});
		await this.page.getByTestId(E2E_TEST_IDS.inbox.detailSynonyms).waitFor({ state: 'visible' });
	}

	async clickSourceWordTts(): Promise<void> {
		await clickTtsAndWaitForSpeak(
			this.page,
			this.page.getByTestId(E2E_TEST_IDS.inbox.detailSourceWordTts)
		);
	}

	async clickExampleSentenceTts(index = 0): Promise<void> {
		await clickTtsAndWaitForSpeak(
			this.page,
			this.page.getByTestId(E2E_TEST_IDS.inbox.detailExampleSentenceTts(index))
		);
	}
}

export function createWordsInboxPage(page: Page): WordsInboxPage {
	return new WordsInboxPage(page);
}
