import type { Locator, Page } from '@playwright/test';
import { E2E_TEST_IDS } from '../helpers/test-ids';

export class ConversationsListPage {
	readonly path = '/conversations';

	readonly heading: Locator;
	readonly list: Locator;
	readonly newButton: Locator;
	readonly filters: Locator;

	constructor(protected readonly page: Page) {
		this.heading = page.getByTestId(E2E_TEST_IDS.conversations.heading);
		this.list = page.getByTestId(E2E_TEST_IDS.conversations.list);
		this.newButton = page.getByTestId(E2E_TEST_IDS.conversations.newButton);
		this.filters = page.getByTestId(E2E_TEST_IDS.conversations.filters);
	}

	conversationRow(id: string): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.conversations.row(id));
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}

	async expectLoaded(): Promise<void> {
		await this.page.getByTestId(E2E_TEST_IDS.sidebar.root).waitFor({ state: 'visible' });
		await this.heading.waitFor({ state: 'visible' });
	}

	async expectFiltersVisible(): Promise<void> {
		await this.filters.waitFor({ state: 'visible' });
	}

	async expectHasConversationRow(id: string): Promise<void> {
		await this.conversationRow(id).waitFor({ state: 'visible' });
	}

	async expectListOrEmptyState(): Promise<void> {
		await this.page
			.getByTestId(E2E_TEST_IDS.conversations.list)
			.or(this.page.getByRole('status'))
			.first()
			.waitFor({ state: 'visible' });
	}

	async clickNewConversation(): Promise<void> {
		await this.newButton.click();
	}

	async openConversation(id: string): Promise<void> {
		await this.conversationRow(id).click();
	}
}
