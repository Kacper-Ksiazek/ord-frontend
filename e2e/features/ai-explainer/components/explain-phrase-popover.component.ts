import { expect, type Page } from '@playwright/test';
import { createSidebarComponent } from '@e2e/app-layouts';
import { E2E_TEST_IDS } from '@e2e/ai-explainer/test-ids';

export type ExplainPhraseRequestBody = {
	phrase: string;
	language: string;
	context: string | null;
	customInstruction: string | null;
};

export type ExplainPhraseFollowUpAction = 'SIMPLER' | 'MORE_EXAMPLES' | 'SIMILAR_EXPRESSIONS';

export type ExplainPhraseFollowUpRequestBody = {
	phrase: string;
	language: string;
	previousExplanation: string;
	action: ExplainPhraseFollowUpAction;
	context: string | null;
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

	private requestTab() {
		return this.page.getByTestId(`${E2E_TEST_IDS.explainPopover.tabs}-tab-request`);
	}

	async clickRequestTab(): Promise<void> {
		await this.requestTab().click();
		await expect(this.root().getByTestId(E2E_TEST_IDS.explainPopover.phrase)).toBeVisible();
	}

	async clickClearAll(): Promise<void> {
		const clear = this.root().getByTestId(E2E_TEST_IDS.explainPopover.clearPhrase);
		await expect(clear).toBeEnabled({ timeout: 15_000 });
		await clear.click();
	}

	async toggleAdvancedForm(): Promise<void> {
		const toggle = this.root().getByTestId(E2E_TEST_IDS.explainPopover.advancedToggle);
		await expect(toggle).toBeEnabled();
		await toggle.click();
	}

	async expectAdvancedFormFieldsEditable(): Promise<void> {
		const context = this.root().getByTestId(E2E_TEST_IDS.explainPopover.context);
		const instruction = this.root().getByTestId(E2E_TEST_IDS.explainPopover.customInstruction);

		await expect(context).toBeVisible();
		await expect(instruction).toBeVisible();
		await expect(context).toBeEnabled();
		await expect(instruction).toBeEnabled();

		const contextSample = 'E2E context for audacity';
		const instructionSample = 'Explain like I am five';

		await context.click();
		await context.fill(contextSample);
		await expect(context).toHaveValue(contextSample);

		await instruction.click();
		await instruction.fill(instructionSample);
		await expect(instruction).toHaveValue(instructionSample);
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

	async clickFollowUpAndWaitForResponse(
		action: ExplainPhraseFollowUpAction
	): Promise<ExplainPhraseFollowUpRequestBody> {
		const button = this.root().getByTestId(E2E_TEST_IDS.explainPopover.followUp(action));
		await expect(button).toBeEnabled({ timeout: 15_000 });

		const followUpResponse = this.page.waitForResponse(
			(response) => {
				if (
					response.request().method() !== 'POST' ||
					!response.url().includes('/api/v1/ai-explainer/explain-phrase/follow-up')
				) {
					return false;
				}
				try {
					const body = response.request().postDataJSON() as ExplainPhraseFollowUpRequestBody;

					return body.action === action;
				} catch {
					return false;
				}
			},
			{ timeout: 30_000 }
		);

		await button.click();

		const response = await followUpResponse;

		if (!response.ok()) {
			const body = await response.text().catch(() => '(body unavailable)');

			throw new Error(`Explain phrase follow-up failed (${response.status()}): ${body}`);
		}

		// SSE: only assert status + request body here. Do not await response.finished() or
		// response.text() — streams may never mark "finished" in CDP, which hangs the test.

		return response.request().postDataJSON() as ExplainPhraseFollowUpRequestBody;
	}

	async waitForMoreExamplesSkeletonHidden(): Promise<void> {
		const skeleton = this.root().getByTestId(E2E_TEST_IDS.explainPopover.moreExamplesSkeleton);
		if (await skeleton.isVisible().catch(() => false)) {
			await expect(skeleton).toBeHidden({ timeout: 45_000 });
		}
	}

	async expectMoreExamplesVisible(): Promise<void> {
		// The pinned e2e stub is prose without "» " lines, so no example rows render.
		await expect(this.root().getByRole('alert')).toHaveCount(0);
	}

	async expectSimplerDefinitionVisible(): Promise<void> {
		await expect(this.root().getByText('simpler take', { exact: false })).toBeVisible({
			timeout: 45_000
		});
	}

	async expectSimilarExpressionsVisible(): Promise<void> {
		// The same stub has no "» expression | translation | note" lines, so no cards render.
		await expect(this.root().getByRole('alert')).toHaveCount(0);
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
