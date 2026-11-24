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

/**
 * @typedef {NonNullable<NonNullable<NonNullable<NonNullable<Parameters<typeof import('@sveltejs/kit/vite').sveltekit>[0]>['csp']>['directives']>['connect-src']>} ConnectSources
 */

/** @returns {ConnectSources} */
function connectSrc() {
	/** @type {ConnectSources} */
	const sources = ['self'];

	for (const value of [publicEnv.PUBLIC_API_URL, publicEnv.PUBLIC_SENTRY_DSN]) {
		const origin = originOf(value);

		const source = /** @type {ConnectSources[number]} */ (origin);

		if (origin && !sources.includes(source)) {
			sources.push(source);
		}
	}

	return sources;
}

/**
 * SvelteKit options for the `sveltekit(...)` Vite plugin (SvelteKit 3 no longer reads svelte.config.js).
 * @type {Parameters<typeof import('@sveltejs/kit/vite').sveltekit>[0]}
 */
export const kitConfig = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
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
						'img-src': [
							'self',
							'data:',
							'https://flagcdn.com',
							'https://gravatar.com',
							'https://www.gravatar.com'
						],
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
	adapter: adapter({
		runtime: 'nodejs22.x'
	}),
	alias: {
		// SvelteKit 3 no longer generates $lib; keep it next to the FDD aliases
		$lib: 'src/lib',
		// Feature-Driven Development (FDD) aliases
		$auth: 'src/lib/features/auth',
		$conversations: 'src/lib/features/conversations',
		$appLayouts: 'src/lib/features/app-layouts',
		$words: 'src/lib/features/words',
		$aiExplainer: 'src/lib/features/ai-explainer',
		$home: 'src/lib/features/home'
	}
};
