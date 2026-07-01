import { test as authTest, expect } from './auth.fixture';
import type { Page } from '@playwright/test';

type ConversationFixtures = {
	/** Page with an active conversation session (created via UI). Placeholder for Phase 3+. */
	conversationPage: Page;
};

/**
 * Extended fixture for conversation flows.
 * Full implementation will be added in Phase 3 (create conversation).
 */
export const test = authTest.extend<ConversationFixtures>({
	conversationPage: async ({ authenticatedPage }, use) => {
		// Phase 3: navigate through create flow and land on /conversations/{id}
		await use(authenticatedPage);
	}
});

export { expect };
