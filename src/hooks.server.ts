import * as Sentry from '@sentry/sveltekit';
import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	// `event.request` is read-only in SvelteKit 3. Our Paraglide strategies (cookie, globalVariable,
	// baseLocale) never rewrite the request URL, so the original request is passed through as is.
	paraglideMiddleware(event.request, ({ locale }) => {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

// SvelteKit 3 also routes app (error(...)) and framework (e.g. 404) errors here.
// Keep their own status and message; only hide and log unexpected errors.
const handleUnexpectedError: HandleServerError = ({ kind, error }) => {
	if (kind !== 'unknown') {
		return;
	}

	console.error('Server error:', error);

	return {
		message: 'An unexpected error occurred'
	};
};

export const handleError = Sentry.handleErrorWithSentry(handleUnexpectedError);

export const handle = sequence(Sentry.sentryHandle(), handleParaglide);
