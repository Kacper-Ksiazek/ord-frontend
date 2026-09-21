import { dev } from '$app/environment';
import { isSentryEnabled } from '$lib/sentry/config';
import { error } from '@sveltejs/kit';

export const ssr = false;

export function load() {
	if (!dev || !isSentryEnabled()) {
		error(404, 'Not found');
	}
}
