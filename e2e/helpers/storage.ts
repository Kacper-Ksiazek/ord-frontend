const USER_STORAGE_KEY = 'ord_app_user';

export async function getStoredUser(
	page: import('@playwright/test').Page
): Promise<string | null> {
	return page.evaluate((key) => localStorage.getItem(key), USER_STORAGE_KEY);
}

export { USER_STORAGE_KEY };
