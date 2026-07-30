import { expect, type Locator, type Page } from '@playwright/test';
import { E2E_TEST_IDS } from '@e2e/conversations/test-ids';

const AI_THINKING_PREFIX = 'Myśli';

export class ConversationSessionPage {
	readonly pathPrefix = '/conversations/';

	readonly pageRoot: Locator;
	readonly messagesPanel: Locator;
	readonly backButton: Locator;
	readonly messageComposer: Locator;
	readonly messageInput: Locator;
	readonly sendButton: Locator;

	constructor(protected readonly page: Page) {
		this.pageRoot = page.getByTestId(E2E_TEST_IDS.session.page);
		this.messagesPanel = page.getByTestId(E2E_TEST_IDS.session.messagesPanel);
		this.backButton = page.getByTestId(E2E_TEST_IDS.session.backButton);
		this.messageComposer = page.getByTestId(E2E_TEST_IDS.session.messageComposer);
		this.messageInput = page.getByTestId(E2E_TEST_IDS.session.messageInput);
		this.sendButton = page.getByTestId(E2E_TEST_IDS.session.sendButton);
	}

	aiMessage(index: number): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.session.aiMessage(index));
	}

	userMessage(index: number): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.session.userMessage(index));
	}

	conversationPath(id: string): string {
		return `${this.pathPrefix}${id}`;
	}

	async goto(id: string): Promise<void> {
		await this.page.goto(this.conversationPath(id));
	}

	async expectLoaded(): Promise<void> {
		await this.pageRoot.waitFor({ state: 'visible' });
		await this.messagesPanel.waitFor({ state: 'visible' });
	}

	async waitForAiMessageContent(index: number, timeout = 60_000): Promise<void> {
		const message = this.aiMessage(index);

		await message.waitFor({ state: 'visible', timeout });

		await expect
			.poll(
				async () => {
					const text = (await message.innerText()).trim();

					return text.length > 0 && !text.startsWith(AI_THINKING_PREFIX);
				},
				{ timeout }
			)
			.toBe(true);
	}

	async waitForAiGreeting(): Promise<void> {
		await this.waitForAiMessageContent(0);
	}

	async expectComposerReady(): Promise<void> {
		await this.messageComposer.waitFor({ state: 'visible' });
		await expect(this.messageInput).toBeEnabled({ timeout: 15_000 });
	}

	async sendMessage(text: string): Promise<void> {
		await this.messageInput.fill(text);
		await this.sendButton.click();
	}

	async waitForUserMessage(index: number): Promise<void> {
		const message = this.userMessage(index);

		await message.waitFor({ state: 'visible' });
		await expect(message.locator('p').first()).not.toBeEmpty();
	}

	async waitForAiReply(index: number): Promise<void> {
		await this.waitForAiMessageContent(index);
	}

	async clickBack(): Promise<void> {
		await this.backButton.click();
	}

	async expectAiMessageCount(count: number): Promise<void> {
		await expect(this.page.locator('[data-testid^="ai-message-"]')).toHaveCount(count);
	}
}

export function createConversationSessionPage(page: Page): ConversationSessionPage {
	return new ConversationSessionPage(page);
}
