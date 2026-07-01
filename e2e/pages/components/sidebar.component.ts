import type { Locator, Page } from '@playwright/test';

/**
 * Sidebar component shared across private layout pages.
 * Component Object — part of the POM hierarchy for reusable UI fragments.
 */
export class SidebarComponent {
	readonly logoutButton: Locator;

	constructor(private readonly page: Page) {
		this.logoutButton = page.locator('button[title="Logout"]');
	}

	userEmail(email: string): Locator {
		return this.page.locator('aside').getByText(email);
	}

	async ensureExpanded(): Promise<void> {
		const expandButton = this.page.locator('button[title="Expand sidebar"]');

		if (await expandButton.isVisible()) {
			await expandButton.click();
		}
	}

	async logout(): Promise<void> {
		await this.logoutButton.click();
		await this.page.waitForURL('**/login');
	}
}
