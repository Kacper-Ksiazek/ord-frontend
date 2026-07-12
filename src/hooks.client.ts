/**
 * Client-side hooks for authentication
 * Runs once when the app initializes in the browser
 */

import { ensureSessionOnNavigate } from '$auth/guards';

export async function handleError({ error }: { error: unknown }) {
	console.error('Client error:', error);

	return {
		message: 'An unexpected error occurred'
	};
}

export function onNavigate() {
	ensureSessionOnNavigate();
}
