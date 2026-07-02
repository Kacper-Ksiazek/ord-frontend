import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import { testEnv } from './fixtures/test-env';

const e2eDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	testDir: './flows',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	// All auth tests share one test user and the backend keeps a single active
	// session per user — parallel logins invalidate each other. Run serially.
	workers: 1,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: path.join(e2eDir, 'playwright-report') }]
	],
	outputDir: path.join(e2eDir, 'test-results'),
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
		command: 'bun run dev',
		url: testEnv.baseUrl,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		env: {
			PUBLIC_API_URL: testEnv.apiUrl
		}
	}
});
