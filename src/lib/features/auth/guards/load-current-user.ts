import { browser } from '$app/environment';
import { httpGetCurrentUser } from '$auth/api-client/api';
import type { UserDTO } from '$auth/types';

export const ssr = false;

/**
 * Fetches the current user from `/me` for private routes.
 *
 * Does not persist to localStorage — callers must sync via `authStore.setUser`
 * (e.g. `PrivateAuthLayout`'s `$effect`) to keep storage in sync.
 */
export async function loadCurrentUser(): Promise<{ user: UserDTO | null }> {
	if (!browser) {
		return { user: null };
	}

	try {
		const user = await httpGetCurrentUser();

		return { user };
	} catch (error) {
		console.error('Failed to fetch current user:', error);

		return { user: null };
	}
}
