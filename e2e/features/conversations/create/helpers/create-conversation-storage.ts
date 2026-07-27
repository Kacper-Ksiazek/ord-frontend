import type { Page } from '@playwright/test';

const DEFAULT_TYPE_STORAGE_KEY = 'default_conversation_type';
const DEFAULT_TONE_STORAGE_KEY = 'default_conversation_tone';

const CREATE_FLOW_STORAGE_KEYS = [DEFAULT_TYPE_STORAGE_KEY, DEFAULT_TONE_STORAGE_KEY] as const;

/** Clears persisted create-flow defaults so the wizard starts at step 0. */
export async function clearCreateConversationStorage(page: Page): Promise<void> {
	await page.evaluate((keys) => {
		for (const key of keys) {
			localStorage.removeItem(key);
		}
	}, CREATE_FLOW_STORAGE_KEYS);
}
