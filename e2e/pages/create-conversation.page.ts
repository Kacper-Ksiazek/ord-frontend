import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the 4-step conversation builder.
 * Full actions will be added in Phase 3.
 */
export class CreateConversationPage extends BasePage {
	readonly path = '/conversations/create';

	readonly multiStepForm: Locator;

	constructor(page: Page) {
		super(page);
		this.multiStepForm = page.locator('form');
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}
}
