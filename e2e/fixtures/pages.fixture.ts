import { test as base } from '@playwright/test';
import { ConversationsListPage, LoginPage, SidebarComponent } from '../pages';

type PageObjectFixtures = {
	loginPage: LoginPage;
	conversationsListPage: ConversationsListPage;
	sidebar: SidebarComponent;
};

/**
 * Playwright fixture that injects Page Objects into every test.
 * Spec files must use these fixtures — never instantiate Page Objects directly.
 */
export const test = base.extend<PageObjectFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
	conversationsListPage: async ({ page }, use) => {
		await use(new ConversationsListPage(page));
	},
	sidebar: async ({ page }, use) => {
		await use(new SidebarComponent(page));
	}
});

export { expect } from '@playwright/test';
