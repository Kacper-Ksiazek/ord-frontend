import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { loadEnv } from 'vite';

const publicEnv = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'PUBLIC_');

/** @param {string | undefined} value */
function originOf(value) {
	if (!value?.trim()) return undefined;

	try {
		return new URL(value).origin;
	} catch {
		return undefined;
	}
}

/** @returns {string[]} */
function connectSrc() {
	/** @type {string[]} */
	const sources = ['self'];

	for (const value of [publicEnv.PUBLIC_API_URL, publicEnv.PUBLIC_SENTRY_DSN]) {
		const origin = originOf(value);

		if (origin && !sources.includes(origin)) {
			sources.push(origin);
		}
	}

	return sources;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// Enforced on production builds only. Dev stays open so HMR and inline
		// styles are not blocked. Origins come from the build environment, so
		// each Vercel deployment (prod, preview) gets its own API and Sentry hosts.
		csp:
			process.env.NODE_ENV === 'production'
				? {
						mode: 'auto',
						directives: {
							'base-uri': ['self'],
							'connect-src': connectSrc(),
							'default-src': ['self'],
							'font-src': ['self'],
							'form-action': ['self'],
							'frame-ancestors': ['none'],
							'img-src': ['self', 'data:', 'https://flagcdn.com'],
							'media-src': ['self', 'blob:'],
							'object-src': ['none'],
							'script-src': ['self'],
							// Transitions inject inline <style> tags. A nonce on style-src
							// makes browsers ignore 'unsafe-inline', so styles stay nonce-free.
							'style-src': ['self', 'unsafe-inline'],
							'worker-src': ['self', 'blob:']
						}
					}
				: undefined,
		experimental: {
			instrumentation: {
				server: true
			}
		},
		adapter: adapter({
			runtime: 'nodejs22.x'
		}),
		alias: {
			// Feature-Driven Development (FDD) aliases
			$auth: 'src/lib/features/auth',
			$conversations: 'src/lib/features/conversations',
			$appLayouts: 'src/lib/features/app-layouts',
			$words: 'src/lib/features/words'
		}
	}
};

export default config;
