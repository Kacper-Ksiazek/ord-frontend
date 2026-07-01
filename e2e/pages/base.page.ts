import type { Page } from '@playwright/test';

/**
 * Base class for all Page Objects.
 * Holds the Playwright Page instance shared by locators and actions.
 */
export abstract class BasePage {
	constructor(protected readonly page: Page) {}
}
