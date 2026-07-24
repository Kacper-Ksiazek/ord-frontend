import type { Locator, Page } from '@playwright/test';
import { E2E_TEST_IDS } from '../helpers/test-ids';

export class ConversationSessionPage {
	readonly pageRoot: Locator;
	readonly messagesPanel: Locator;

	constructor(protected readonly page: Page) {
		this.pageRoot = page.getByTestId(E2E_TEST_IDS.session.page);
		this.messagesPanel = page.getByTestId(E2E_TEST_IDS.session.messagesPanel);
	}

	conversationPath(id: string): string {
		return `/conversations/${id}`;
	}

	async goto(id: string): Promise<void> {
		await this.page.goto(this.conversationPath(id));
	}

	async expectLoaded(): Promise<void> {
		await this.pageRoot.waitFor({ state: 'visible' });
		await this.messagesPanel.waitFor({ state: 'visible' });
	}
}
