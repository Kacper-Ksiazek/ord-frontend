import type { Page } from '@playwright/test';
import { ConversationsListPage, LoginPage, SidebarComponent } from '../pages';

/**
 * Factory helpers for Page Objects bound to a specific Playwright page.
 * Use when a test opens an additional browser context (e.g. storageState restore).
 */
export function createLoginPage(page: Page): LoginPage {
	return new LoginPage(page);
}

export function createConversationsListPage(page: Page): ConversationsListPage {
	return new ConversationsListPage(page);
}

export function createSidebar(page: Page): SidebarComponent {
	return new SidebarComponent(page);
}
