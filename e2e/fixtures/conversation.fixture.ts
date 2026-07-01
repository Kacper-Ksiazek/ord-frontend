import { test as authTest, expect } from './auth.fixture';
import type { Page } from '@playwright/test';

type ConversationFixtures = {
	/** Page with an active conversation session (created via UI). Placeholder for Phase 3+. */
	conversationPage: Page;
};

/**
 * Extended fixture for conversation flows.
 * Phase 3: use createConversationPage + conversationSessionPage from pages.fixture.
 */
export const test = authTest.extend<ConversationFixtures>({
	conversationPage: async ({ authenticatedPage }, use) => {
		await use(authenticatedPage);
	}
});

export { expect };
