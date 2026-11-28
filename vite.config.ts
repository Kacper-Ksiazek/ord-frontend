import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sentrySvelteKit } from '@sentry/sveltekit/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, loadEnv } from 'vite';
import { kitConfig } from './kit.config.js';

export default defineConfig(({ mode }) => {
	const sentryEnv = loadEnv(mode, process.cwd(), 'SENTRY_');
	const sentryAuthToken = sentryEnv.SENTRY_AUTH_TOKEN?.trim();

	return {
		plugins: [
			sentrySvelteKit({
				adapter: 'vercel',
				org: sentryEnv.SENTRY_ORG ?? 'kksiazek',
				project: sentryEnv.SENTRY_PROJECT ?? 'ord-ui',
				authToken: sentryAuthToken,
				autoUploadSourceMaps: Boolean(sentryAuthToken)
			}),
			tailwindcss(),
			sveltekit(kitConfig),
			paraglideVitePlugin({
				project: './project.inlang',
				outdir: './src/lib/paraglide'
			})
		],
		test: {
			expect: { requireAssertions: true },
			reporters: ['default', './scripts/reporters/vitest-summary-reporter.ts'],
			projects: [
				{
					extends: './vite.config.ts',
					test: {
						name: 'client',
						browser: {
							enabled: true,
							provider: playwright(),
							instances: [{ browser: 'chromium' }]
						},
						include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
						exclude: ['src/lib/server/**'],
						setupFiles: ['./vitest-setup-client.ts']
					}
				},
				// Every story renders as a smoke + a11y test, once per theme.
				...(['light', 'dark'] as const).map((theme) => ({
					extends: './vite.config.ts',
					plugins: [storybookTest({ initialGlobals: { theme } })],
					test: {
						name: `storybook-${theme}`,
						browser: {
							enabled: true,
							headless: true,
							provider: playwright(),
							instances: [{ browser: 'chromium' as const }]
						}
					}
				})),
				{
					extends: './vite.config.ts',
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				}
			]
		}
	};
});
