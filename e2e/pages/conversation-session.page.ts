import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for an active conversation session (`/conversations/[id]`).
 * SSE wait helpers live here — session-specific behaviour belongs in the Page Object.
 */
export class ConversationSessionPage extends BasePage {
	readonly messageTextarea: Locator;
	readonly sendButton: Locator;

	constructor(page: Page) {
		super(page);

		this.messageTextarea = page.locator('textarea');
		this.sendButton = page.locator('button[type="submit"]');
	}

	async waitForAiGenerationComplete(options: { timeout?: number } = {}): Promise<void> {
		const timeout = options.timeout ?? 60_000;

		await this.page.waitForFunction(
			() => {
				const loadingIndicators = document.querySelectorAll(
					'[data-testid="ai-generating"], .animate-pulse, [aria-busy="true"]'
				);

				if (loadingIndicators.length > 0) {
					return false;
				}

				const messages = document.querySelectorAll(
					'[data-testid="ai-message"], [data-testid="message"]'
				);

				return messages.length > 0;
			},
			{ timeout }
		);
	}

	async waitForMessageCount(count: number, options: { timeout?: number } = {}): Promise<void> {
		const timeout = options.timeout ?? 30_000;

		await this.page.waitForFunction(
			(expectedCount) => {
				const messages = document.querySelectorAll('[data-testid="message"]');
				return messages.length >= expectedCount;
			},
			count,
			{ timeout }
		);
	}

	async sendMessage(text: string): Promise<void> {
		await this.messageTextarea.fill(text);
		await this.messageTextarea.press('Enter');
	}
}
