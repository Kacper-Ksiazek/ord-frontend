import { STORAGE_KEYS } from '../../src/lib/utils/local-storage';

type SeedUser = {
	id: string;
	email: string;
	name: string;
	selectedLearningLanguage: string;
};

/**
 * Non-UI test utilities for localStorage manipulation.
 * Kept outside Page Objects — storage is not a page concern.
 */
export async function seedUserInLocalStorage(
	page: import('@playwright/test').Page,
	user: SeedUser
): Promise<void> {
	await page.evaluate(
		({ userKey, sessionKey, userData }) => {
			localStorage.setItem(userKey, JSON.stringify(userData));
			localStorage.setItem(sessionKey, JSON.stringify(true));
		},
		{
			userKey: STORAGE_KEYS.USER,
			sessionKey: STORAGE_KEYS.SESSION_INITIALIZED,
			userData: user
		}
	);
}

export async function getStoredUser(
	page: import('@playwright/test').Page
): Promise<string | null> {
	return page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.USER);
}

export { STORAGE_KEYS };
