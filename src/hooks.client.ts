/**
 * Client-side hooks.
 * `onNavigate` runs on every client navigation; the once-per-session auth
 * check is handled inside `ensureSessionOnNavigate`.
 */

import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit/hooks';
import { ensureSessionOnNavigate } from '$auth/guards';
import { getSentryOptions } from '$lib/sentry/config';

Sentry.init(getSentryOptions());

// SvelteKit 3 also routes app (error(...)) and framework (e.g. 404) errors here.
// Keep their own status and message; only hide and log unexpected errors.
const handleUnexpectedError: HandleClientError = ({ kind, error }) => {
	if (kind !== 'unknown') {
		return;
	}

	console.error('Client error:', error);

	return {
		message: 'An unexpected error occurred'
	};
};

export const handleError = Sentry.handleErrorWithSentry(handleUnexpectedError);

export function onNavigate() {
	ensureSessionOnNavigate();
}
