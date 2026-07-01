import type { Locator, Page } from '@playwright/test';

/**
 * Sidebar component shared across private layout pages.
 * Component Object — part of the POM hierarchy for reusable UI fragments.
 */
export class SidebarComponent {
	readonly logoutButton: Locator;
	readonly conversationsLink: Locator;

	constructor(private readonly page: Page) {
		this.logoutButton = page.locator('button[title="Logout"]');
		this.conversationsLink = page.locator('a[href="/conversations"]');
	}

	userEmail(email: string): Locator {
		return this.page.locator('aside').getByText(email);
	}

	async logout(): Promise<void> {
		await this.logoutButton.click();
		await this.page.waitForURL('**/login');
	}

	async goToConversations(): Promise<void> {
		await this.conversationsLink.click();
		await this.page.waitForURL(/\/conversations/);
	}
}
