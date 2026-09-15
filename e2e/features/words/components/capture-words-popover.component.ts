import { expect, type Page } from '@playwright/test';
import { createSidebarComponent } from '@e2e/app-layouts';
import { E2E_TEST_IDS } from '@e2e/words/test-ids';

export class CaptureWordsPopoverComponent {
	constructor(private readonly page: Page) {}

	async openFromSidebar(): Promise<void> {
		const sidebar = createSidebarComponent(this.page);
		await sidebar.ensureExpanded();
		await this.page.getByTestId(E2E_TEST_IDS.capturePopover.trigger).click();
		await this.expectOpen();
	}

	async expectOpen(): Promise<void> {
		await this.page.getByTestId(E2E_TEST_IDS.capturePopover.root).waitFor({ state: 'visible' });
	}

	async fillWord(index: number, word: string): Promise<void> {
		await this.page.getByTestId(E2E_TEST_IDS.capturePopover.wordInput(index)).fill(word);
	}

	async clickFillWithAi(): Promise<void> {
		const fillGapsResponse = this.page.waitForResponse(
			(response) =>
				response.request().method() === 'POST' && response.url().includes('/api/v1/words/ai/fill-gaps'),
			{ timeout: 30_000 }
		);

		await this.page.getByTestId(E2E_TEST_IDS.capturePopover.fillWithAi).click();

		const response = await fillGapsResponse;

		if (!response.ok()) {
			const body = await response.text();

			throw new Error(`Fill with AI failed (${response.status()}): ${body}`);
		}
	}

	async waitForFillComplete(index = 0): Promise<void> {
		const root = this.page.getByTestId(E2E_TEST_IDS.capturePopover.root);

		await expect(root.getByTestId(E2E_TEST_IDS.capturePopover.fillRowOverlay)).toHaveCount(0, {
			timeout: 30_000
		});
		await expect(
			root.getByTestId(E2E_TEST_IDS.capturePopover.translationInput(index))
		).not.toHaveValue('', { timeout: 30_000 });
	}

	async clickSave(): Promise<void> {
		const saveResponse = this.page.waitForResponse(
			(response) =>
				response.request().method() === 'POST' &&
				/\/api\/v1\/words\/?$/.test(new URL(response.url()).pathname),
			{ timeout: 30_000 }
		);

		await this.page.getByTestId(E2E_TEST_IDS.capturePopover.save).click();

		const response = await saveResponse;

		if (!response.ok()) {
			const body = await response.text();

			throw new Error(`Save word failed (${response.status()}): ${body}`);
		}
	}

	async waitForClosed(): Promise<void> {
		await expect(this.page.getByTestId(E2E_TEST_IDS.capturePopover.root)).toBeHidden({
			timeout: 30_000
		});
	}
}

export function createCaptureWordsPopoverComponent(page: Page): CaptureWordsPopoverComponent {
	return new CaptureWordsPopoverComponent(page);
}
