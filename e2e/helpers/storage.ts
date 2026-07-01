const USER_STORAGE_KEY = 'ord_app_user';
const SESSION_INITIALIZED_KEY = 'ord_app_session_initialized';

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
			userKey: USER_STORAGE_KEY,
			sessionKey: SESSION_INITIALIZED_KEY,
			userData: user
		}
	);
}

export async function getStoredUser(
	page: import('@playwright/test').Page
): Promise<string | null> {
	return page.evaluate((key) => localStorage.getItem(key), USER_STORAGE_KEY);
}

export { USER_STORAGE_KEY };
