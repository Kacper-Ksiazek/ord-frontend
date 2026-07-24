import { test as base } from '@playwright/test';
import {
	ConversationSessionPage,
	ConversationsListPage,
	CreateConversationPage,
	LoginPage,
	SidebarComponent
} from '../pages';

type PageObjectFixtures = {
	loginPage: LoginPage;
	conversationsListPage: ConversationsListPage;
	createConversationPage: CreateConversationPage;
	conversationSessionPage: ConversationSessionPage;
	sidebar: SidebarComponent;
};

/**
 * Playwright fixture that injects Page Objects into every test.
 * For additional browser contexts, use factories from `e2e/helpers/page-objects.ts`.
 */
export const test = base.extend<PageObjectFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
	conversationsListPage: async ({ page }, use) => {
		await use(new ConversationsListPage(page));
	},
	createConversationPage: async ({ page }, use) => {
		await use(new CreateConversationPage(page));
	},
	conversationSessionPage: async ({ page }, use) => {
		await use(new ConversationSessionPage(page));
	},
	sidebar: async ({ page }, use) => {
		await use(new SidebarComponent(page));
	}
});

export { expect } from '@playwright/test';
