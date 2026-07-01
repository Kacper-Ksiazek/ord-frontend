import type { Locator, Page } from '@playwright/test';
import { E2E_TEST_IDS } from '../../helpers/test-ids';

/**
 * Sidebar component shared across private layout pages.
 * Component Object — part of the POM hierarchy for reusable UI fragments.
 */
export class SidebarComponent {
	readonly logoutButton: Locator;
	readonly toggleButton: Locator;

	constructor(private readonly page: Page) {
		this.logoutButton = page.getByTestId(E2E_TEST_IDS.sidebar.logout);
		this.toggleButton = page.getByTestId(E2E_TEST_IDS.sidebar.toggle);
	}

	userEmail(email: string): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.sidebar.userEmail).filter({ hasText: email });
	}

	async ensureExpanded(): Promise<void> {
		if (await this.toggleButton.isVisible()) {
			const title = await this.toggleButton.getAttribute('title');
			if (title === 'Expand sidebar') {
				await this.toggleButton.click();
			}
		}
	}

	async logout(): Promise<void> {
		await this.logoutButton.click();
		await this.page.waitForURL('**/login');
	}
}
