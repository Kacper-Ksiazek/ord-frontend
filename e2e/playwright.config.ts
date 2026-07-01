import { loadEnvE2e } from './helpers/load-env';

loadEnvE2e();

import { defineConfig, devices } from '@playwright/test';
import { testEnv } from './fixtures/test-env';

export default defineConfig({
	testDir: './flows',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: 'playwright-report' }]
	],
	outputDir: 'test-results',
	timeout: 60_000,
	expect: {
		timeout: 15_000
	},
	use: {
		baseURL: testEnv.baseUrl,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'npm run dev',
		url: testEnv.baseUrl,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		env: {
			PUBLIC_API_URL: testEnv.apiUrl
		}
	}
});
