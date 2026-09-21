/**
 * Client-side hooks.
 * `onNavigate` runs on every client navigation; the once-per-session auth
 * check is handled inside `ensureSessionOnNavigate`.
 */

import * as Sentry from '@sentry/sveltekit';
import { ensureSessionOnNavigate } from '$auth/guards';
import { getSentryOptions } from '$lib/sentry/config';

Sentry.init(getSentryOptions());

export const handleError = Sentry.handleErrorWithSentry(({ error }) => {
	console.error('Client error:', error);

	return {
		message: 'An unexpected error occurred'
	};
});

export function onNavigate() {
	ensureSessionOnNavigate();
}
