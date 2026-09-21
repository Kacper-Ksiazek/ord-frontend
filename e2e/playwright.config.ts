import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import { testEnv } from './shared/fixtures/test-env';

const e2eDir = path.dirname(fileURLToPath(import.meta.url));
const isCi = !!process.env.CI;
const recordVideo = process.env.E2E_RECORD_VIDEO === 'true';

export default defineConfig({
	testDir: './journeys',
	globalSetup: path.join(e2eDir, 'global-setup.ts'),
	forbidOnly: isCi,
	retries: 1,
	// CI runs journeys in parallel; locally use one worker to avoid OTP login stampede on cold Vite.
	workers: isCi ? 3 : 1,
	reporter: [
		['../scripts/reporters/playwright-reporter.ts'],
		['html', { open: 'never', outputFolder: path.join(e2eDir, 'playwright-report') }]
	],
	outputDir: path.join(e2eDir, 'test-results'),
	timeout: 120_000,
	expect: {
		timeout: 8_000
	},
	use: {
		baseURL: testEnv.baseUrl,
		actionTimeout: 15_000,
		navigationTimeout: 30_000,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: recordVideo ? 'on' : 'retain-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				// Playwright 1.62 drops top-level `reducedMotion`; only `contextOptions` is forwarded.
				// Login uses introStagger, which hides the form until JS runs unless motion is reduced.
				contextOptions: {
					reducedMotion: 'reduce'
				}
			}
		}
	],
	webServer: {
		command: 'bun run dev',
		url: testEnv.baseUrl,
		// Never reuse a casual dev server during E2E — it may have PUBLIC_DEV_LOGIN_EMAIL prefilled.
		reuseExistingServer: !process.env.CI && !process.env.PUBLIC_E2E,
		timeout: 120_000,
		env: {
			PUBLIC_API_URL: testEnv.apiUrl,
			PUBLIC_E2E: 'true'
		}
	}
});
