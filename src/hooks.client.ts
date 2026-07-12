/**
 * Client-side hooks.
 * `onNavigate` runs on every client navigation; the once-per-session auth
 * check is handled inside `ensureSessionOnNavigate`.
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
