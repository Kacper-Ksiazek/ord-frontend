import type { Page } from '@playwright/test';
import { ConversationsListPage } from '../pages';

/**
 * Factory helpers for Page Objects bound to a specific Playwright page.
 * Use when a test opens an additional browser context (e.g. storageState restore).
 */
export function createConversationsListPage(page: Page): ConversationsListPage {
	return new ConversationsListPage(page);
}
