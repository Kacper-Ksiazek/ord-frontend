import { STORAGE_KEYS } from '../../src/lib/utils/local-storage';

export async function getStoredUser(page: import('@playwright/test').Page): Promise<string | null> {
	return page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.USER);
}
