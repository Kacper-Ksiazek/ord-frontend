import { expect, type Locator, type Page } from '@playwright/test';
import { clearCreateConversationStorage } from '../helpers/create-conversation-storage';
import { E2E_TEST_IDS } from '../helpers/test-ids';

export type CreateFlowStep = 'type' | 'tone' | 'topic' | 'summary';

export type EnabledConversationType = 'SMALL_TALK' | 'TOPIC_EXPLORATION';

export type ConversationTone =
	| 'FRIENDLY'
	| 'FORMAL'
	| 'HUMOROUS'
	| 'NEUTRAL'
	| 'ENCOURAGING'
	| 'CHALLENGING';

const STEP_TEST_IDS: Record<CreateFlowStep, string> = {
	type: E2E_TEST_IDS.createConversation.stepType,
	tone: E2E_TEST_IDS.createConversation.stepTone,
	topic: E2E_TEST_IDS.createConversation.stepTopic,
	summary: E2E_TEST_IDS.createConversation.stepSummary
};

export class CreateConversationPage {
	readonly path = '/conversations/create';

	readonly pageRoot: Locator;
	readonly stepper: Locator;
	readonly nextButton: Locator;
	readonly previousButton: Locator;
	readonly startButton: Locator;

	constructor(protected readonly page: Page) {
		this.pageRoot = page.getByTestId(E2E_TEST_IDS.createConversation.page);
		this.stepper = page.getByTestId(E2E_TEST_IDS.createConversation.stepper);
		this.nextButton = page.getByTestId(E2E_TEST_IDS.createConversation.next);
		this.previousButton = page.getByTestId(E2E_TEST_IDS.createConversation.previous);
		this.startButton = page.getByTestId(E2E_TEST_IDS.createConversation.start);
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}

	async gotoFresh(): Promise<void> {
		await this.page.goto(this.path);
		await this.clearStoredDefaults();
		await this.page.goto(this.path);
		await this.expectLoaded();
		await this.expectStepVisible('type');
	}

	async clearStoredDefaults(): Promise<void> {
		await clearCreateConversationStorage(this.page);
	}

	async expectLoaded(): Promise<void> {
		await this.pageRoot.waitFor({ state: 'visible' });
		await this.stepper.waitFor({ state: 'visible' });
	}

	async expectStepVisible(step: CreateFlowStep): Promise<void> {
		await this.page.getByTestId(STEP_TEST_IDS[step]).waitFor({ state: 'visible' });
	}

	async expectNextDisabled(): Promise<void> {
		await expect(this.nextButton).toBeDisabled();
	}

	async expectNextEnabled(): Promise<void> {
		await expect(this.nextButton).toBeEnabled();
	}

	async expectPreviousVisible(): Promise<void> {
		await expect(this.previousButton).toBeVisible();
	}

	private async activateButton(button: Locator): Promise<void> {
		await button.scrollIntoViewIfNeeded();
		await button.evaluate((element: HTMLButtonElement) => element.click());
	}

	async clickNext(): Promise<void> {
		await this.activateButton(this.nextButton);
	}

	async clickPrevious(): Promise<void> {
		await this.activateButton(this.previousButton);
	}

	async clickStart(): Promise<void> {
		await this.activateButton(this.startButton);
	}

	async selectType(type: EnabledConversationType): Promise<void> {
		const card = this.page.getByTestId(E2E_TEST_IDS.createConversation.typeCard(type));
		await card.scrollIntoViewIfNeeded();
		await card.evaluate((element: HTMLElement) => element.click());
	}

	async selectTone(tone: ConversationTone): Promise<void> {
		const card = this.page.getByTestId(E2E_TEST_IDS.createConversation.toneCard(tone));
		await card.scrollIntoViewIfNeeded();
		await card.evaluate((element: HTMLElement) => element.click());
	}

	async selectTopicRow(index: number): Promise<void> {
		const row = this.page.getByTestId(E2E_TEST_IDS.createConversation.topicRow(index));
		await row.scrollIntoViewIfNeeded();
		await row.evaluate((element: HTMLElement) => element.click());
	}

	async enterCustomTopic(topic: string): Promise<void> {
		await this.page.getByTestId(E2E_TEST_IDS.createConversation.topicCustomToggle).click();
		await this.page.getByTestId(E2E_TEST_IDS.createConversation.topicCustomInput).fill(topic);
	}

	async completeTypeToneTopicSteps(
		type: EnabledConversationType = 'SMALL_TALK',
		tone: ConversationTone = 'FRIENDLY',
		topicIndex = 0
	): Promise<void> {
		await this.expectStepVisible('type');
		await this.selectType(type);
		await this.clickNext();

		await this.expectStepVisible('tone');
		await this.selectTone(tone);
		await this.clickNext();

		await this.expectStepVisible('topic');
		await this.selectTopicRow(topicIndex);
		await this.clickNext();

		await this.expectStepVisible('summary');
		await this.waitForSummaryReady();
	}

	async waitForSummaryReady(): Promise<void> {
		await this.expectStepVisible('summary');
		await this.page
			.getByTestId(E2E_TEST_IDS.createConversation.regenerateInterlocutor)
			.waitFor({ state: 'visible', timeout: 15_000 });
	}

	async startConversationAndWaitForSession(): Promise<void> {
		await this.waitForSummaryReady();
		await this.clickStart();
		await this.page.waitForURL(
			(url) => url.pathname.startsWith('/conversations/') && url.pathname !== '/conversations/create',
			{ timeout: 30_000 }
		);
	}
}
