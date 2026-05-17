import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			// Feature-Driven Development (FDD) aliases
			$auth: 'src/lib/features/auth',
			$conversations: 'src/lib/features/conversations',
			$appLayouts: 'src/lib/features/app-layouts'
		}
	}
};

export default config;
