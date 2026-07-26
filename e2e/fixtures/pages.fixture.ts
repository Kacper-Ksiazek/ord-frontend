import { test as base } from '@playwright/test';
import { LoginPage } from '../pages';

type PageObjectFixtures = {
	loginPage: LoginPage;
};

/**
 * Shared Playwright fixture — login page only (unauthenticated flows).
 * Module-specific page objects: factories in `e2e/helpers/page-objects.ts`.
 */
export const test = base.extend<PageObjectFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	}
});

export { expect } from '@playwright/test';
