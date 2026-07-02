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
		await this.page.getByTestId(E2E_TEST_IDS.sidebar.root).waitFor({ state: 'visible' });

		if ((await this.toggleButton.getAttribute('title')) === 'Expand sidebar') {
			await this.toggleButton.click();
			await this.page
				.locator(`[data-testid="${E2E_TEST_IDS.sidebar.toggle}"][title="Collapse sidebar"]`)
				.waitFor({ state: 'visible' });
		}
	}

	async expectUserEmailVisible(email: string): Promise<void> {
		await this.ensureExpanded();
		await this.userEmail(email).waitFor({ state: 'visible' });
	}

	async logout(): Promise<void> {
		await this.logoutButton.click();
		await this.page.waitForURL('**/login');
	}
}
