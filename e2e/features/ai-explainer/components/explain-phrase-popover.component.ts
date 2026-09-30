import { expect, type Page } from '@playwright/test';
import { createSidebarComponent } from '@e2e/app-layouts';
import { E2E_TEST_IDS } from '@e2e/ai-explainer/test-ids';

export type ExplainPhraseRequestBody = {
	phrase: string;
	language: string;
	context: string | null;
	customInstruction: string | null;
};

export class ExplainPhrasePopoverComponent {
	constructor(private readonly page: Page) {}

	private root() {
		return this.page.getByTestId(E2E_TEST_IDS.explainPopover.root);
	}

	async openFromSidebar(): Promise<void> {
		const sidebar = createSidebarComponent(this.page);
		await sidebar.ensureExpanded();
		await this.page.getByTestId(E2E_TEST_IDS.explainPopover.trigger).click();
		await this.expectModalInUrl(true);
		await this.expectOpen();
	}

	async expectOpen(): Promise<void> {
		await this.root().waitFor({ state: 'visible' });
	}

	async expectClosed(): Promise<void> {
		await expect(this.root()).toBeHidden({
			timeout: 15_000
		});
	}

	async expectModalInUrl(open: boolean): Promise<void> {
		await expect
			.poll(() => new URL(this.page.url()).searchParams.get('modal'), { timeout: 8_000 })
			.toBe(open ? 'explain' : null);
	}

	async expectAnswerTabDisabled(): Promise<void> {
		await expect(
			this.page.getByTestId(`${E2E_TEST_IDS.explainPopover.tabs}-tab-answer`)
		).toBeDisabled();
	}

	async fillPhrase(phrase: string): Promise<void> {
		const phraseInput = this.root().getByTestId(E2E_TEST_IDS.explainPopover.phrase);
		await phraseInput.click();
		await phraseInput.clear();
		await phraseInput.pressSequentially(phrase);

		const submit = this.root().getByTestId(E2E_TEST_IDS.explainPopover.submit);
		await expect(submit).toBeEnabled({ timeout: 15_000 });
	}

	async clickClose(): Promise<void> {
		await this.root().getByTestId(E2E_TEST_IDS.explainPopover.close).click();
	}

	async clickExplainAndWaitForResponse(): Promise<ExplainPhraseRequestBody> {
		const submit = this.root().getByTestId(E2E_TEST_IDS.explainPopover.submit);
		await expect(submit).toBeEnabled();

		const explainResponse = this.page.waitForResponse(
			(response) =>
				response.request().method() === 'POST' &&
				response.url().includes('/api/v1/ai-explainer/explain-phrase') &&
				!response.url().includes('/follow-up'),
			{ timeout: 30_000 }
		);

		await submit.click();

		const response = await explainResponse;

		if (!response.ok()) {
			const body = await response.text();

			throw new Error(`Explain phrase failed (${response.status()}): ${body}`);
		}

		return response.request().postDataJSON() as ExplainPhraseRequestBody;
	}

	async waitForExplanationComplete(): Promise<void> {
		const skeleton = this.root().getByTestId(E2E_TEST_IDS.explainPopover.explanationSkeleton);
		const explanation = this.root().getByTestId(E2E_TEST_IDS.explainPopover.explanation);

		if (await skeleton.isVisible().catch(() => false)) {
			await expect(skeleton).toBeHidden({ timeout: 45_000 });
		}

		await expect(explanation).toBeVisible({ timeout: 45_000 });
		await expect
			.poll(async () => (await explanation.innerText()).trim().length > 0, { timeout: 45_000 })
			.toBe(true);
	}
}

export function createExplainPhrasePopoverComponent(page: Page): ExplainPhrasePopoverComponent {
	return new ExplainPhrasePopoverComponent(page);
}
