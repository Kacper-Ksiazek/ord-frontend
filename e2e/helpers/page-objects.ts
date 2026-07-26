import type { Page } from '@playwright/test';
import {
	ConversationSessionPage,
	ConversationsListPage,
	CreateConversationPage,
	SidebarComponent
} from '../pages';

/**
 * Factory helpers for Page Objects bound to a specific Playwright page.
 * Use when a test opens an additional browser context (e.g. storageState restore).
 */
export function createConversationsListPage(page: Page): ConversationsListPage {
	return new ConversationsListPage(page);
}

export function createCreateConversationPage(page: Page): CreateConversationPage {
	return new CreateConversationPage(page);
}

export function createConversationSessionPage(page: Page): ConversationSessionPage {
	return new ConversationSessionPage(page);
}

export function createSidebarComponent(page: Page): SidebarComponent {
	return new SidebarComponent(page);
}
