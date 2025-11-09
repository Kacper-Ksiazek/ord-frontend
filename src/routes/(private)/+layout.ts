import { browser } from '$app/environment';
import { getCurrentUser } from '$lib/api-client/auth/api/get-current-user';
import { STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';
import type { LayoutLoad } from './$types';

export const ssr = false; // Disable SSR for private routes

export const load: LayoutLoad = async () => {
	// Only fetch on client side
	if (!browser) {
		return { user: null };
	}

	try {
		// Call /me endpoint to get fresh user data
		const user = await getCurrentUser();

		// Update localStorage with fresh data
		setStorageItem(STORAGE_KEYS.USER, user);

		return { user };
	} catch (error) {
		console.error('Failed to fetch current user:', error);
		// If the request fails, clear auth and redirect will happen in layout
		return { user: null };
	}
};
