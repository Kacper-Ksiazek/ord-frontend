import type { Locator, Page } from '@playwright/test';
import { E2E_TEST_IDS } from '../helpers/test-ids';

export class CreateConversationPage {
	readonly path = '/conversations/create';

	readonly pageRoot: Locator;
	readonly stepper: Locator;

	constructor(protected readonly page: Page) {
		this.pageRoot = page.getByTestId(E2E_TEST_IDS.createConversation.page);
		this.stepper = page.getByTestId(E2E_TEST_IDS.createConversation.stepper);
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
	}

	async expectLoaded(): Promise<void> {
		await this.pageRoot.waitFor({ state: 'visible' });
		await this.stepper.waitFor({ state: 'visible' });
	}
}
