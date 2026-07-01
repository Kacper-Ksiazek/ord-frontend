import type { Locator, Page } from '@playwright/test';

export class ConversationsListPage {
	readonly path = '/conversations';

	readonly heading: Locator;

	constructor(protected readonly page: Page) {
		this.heading = page.getByRole('heading', { name: 'Conversations' });
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}

	async expectLoaded(): Promise<void> {
		await this.heading.waitFor({ state: 'visible' });
	}
}
