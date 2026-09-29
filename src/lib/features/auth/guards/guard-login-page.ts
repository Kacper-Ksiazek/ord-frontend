import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { httpGetCurrentUser } from '$auth/api-client/api';
import { authStore } from '$auth/stores';
import { getStorageItem, STORAGE_KEYS } from '$lib/utils/local-storage';

export const ssr = false;

/**
 * Login-page load. A stored user is confirmed with `/me`.
 * Success redirects to `/`. Any failure clears that user and leaves the form.
 */
export async function loadLoginPage(): Promise<void> {
	if (!browser) {
		return;
	}

	const storedUser = getStorageItem(STORAGE_KEYS.USER);

	if (!storedUser) {
		return;
	}

	try {
		const user = await httpGetCurrentUser();

		authStore.setUser(user);
	} catch (error) {
		console.error('Failed to confirm session on login page:', error);
		authStore.clearUser();

		return;
	}

	redirect(307, '/');
}
