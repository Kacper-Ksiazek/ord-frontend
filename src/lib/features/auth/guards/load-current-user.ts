import { browser } from '$app/environment';
import { getCurrentUser } from '$auth/api-client/api';
import type { UserDTO } from '$auth/types';

export const ssr = false;

export async function loadCurrentUser(): Promise<{ user: UserDTO | null }> {
	if (!browser) {
		return { user: null };
	}

	try {
		const user = await getCurrentUser();

		return { user };
	} catch (error) {
		console.error('Failed to fetch current user:', error);

		return { user: null };
	}
}
