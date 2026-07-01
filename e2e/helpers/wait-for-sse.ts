import type { Page } from '@playwright/test';

/**
 * Waits until AI message generation appears complete.
 * Detects disappearance of loading indicators or presence of a new AI message bubble.
 */
export async function waitForAiGenerationComplete(
	page: Page,
	options: { timeout?: number } = {}
): Promise<void> {
	const timeout = options.timeout ?? 60_000;

	await page.waitForFunction(
		() => {
			const loadingIndicators = document.querySelectorAll(
				'[data-testid="ai-generating"], .animate-pulse, [aria-busy="true"]'
			);

			if (loadingIndicators.length > 0) {
				return false;
			}

			const messages = document.querySelectorAll('[data-testid="ai-message"], [data-testid="message"]');

			return messages.length > 0;
		},
		{ timeout }
	);
}

/**
 * Waits for at least `count` messages to appear in the conversation panel.
 */
export async function waitForMessageCount(
	page: Page,
	count: number,
	options: { timeout?: number } = {}
): Promise<void> {
	const timeout = options.timeout ?? 30_000;

	await page.waitForFunction(
		(expectedCount) => {
			const messages = document.querySelectorAll('[data-testid="message"]');
			return messages.length >= expectedCount;
		},
		count,
		{ timeout }
	);
}
