import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ConversationsListPage extends BasePage {
	readonly path = '/conversations';

	readonly heading: Locator;
	readonly newConversationButton: Locator;
	readonly conversationList: Locator;

	constructor(page: Page) {
		super(page);

		this.heading = page.getByRole('heading', { name: 'Conversations' });
		this.newConversationButton = page.getByRole('button', { name: 'New conversation' });
		this.conversationList = page.locator('[aria-label="Your conversations"]');
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}

	async expectLoaded(): Promise<void> {
		await this.heading.waitFor({ state: 'visible' });
	}

	conversationRow(index = 0): Locator {
		return this.conversationList.locator('a, button').nth(index);
	}

	async openNewConversation(): Promise<void> {
		await this.newConversationButton.click();
		await this.page.waitForURL(/\/conversations\/create/);
	}

	async openConversationAt(index = 0): Promise<void> {
		await this.conversationRow(index).click();
		await this.page.waitForURL(/\/conversations\/[^/]+$/);
	}
}
