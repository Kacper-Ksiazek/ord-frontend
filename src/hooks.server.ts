import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handleError = Sentry.handleErrorWithSentry(({ error }) => {
	console.error('Server error:', error);

	return {
		message: 'An unexpected error occurred'
	};
});

export const handle = sequence(Sentry.sentryHandle(), handleParaglide);
