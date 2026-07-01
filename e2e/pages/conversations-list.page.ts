import type { Locator, Page } from '@playwright/test';
import { E2E_TEST_IDS } from '../helpers/test-ids';

export class ConversationsListPage {
	readonly path = '/conversations';

	readonly heading: Locator;
	readonly list: Locator;
	readonly newButton: Locator;

	constructor(protected readonly page: Page) {
		this.heading = page.getByTestId(E2E_TEST_IDS.conversations.heading);
		this.list = page.getByTestId(E2E_TEST_IDS.conversations.list);
		this.newButton = page.getByTestId(E2E_TEST_IDS.conversations.newButton);
	}

	conversationRow(id: string): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.conversations.row(id));
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}

	async expectLoaded(): Promise<void> {
		await this.heading.waitFor({ state: 'visible' });
	}
}
