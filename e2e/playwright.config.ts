import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import { testEnv } from './shared/fixtures/test-env';

const e2eDir = path.dirname(fileURLToPath(import.meta.url));
const isCi = !!process.env.CI;

export default defineConfig({
	testDir: './journeys',
	globalSetup: path.join(e2eDir, 'global-setup.ts'),
	forbidOnly: isCi,
	retries: 0,
	// One worker per journey test; workerIndex maps to e2e-ci-w{n}@ord.test.
	workers: 2,
	reporter: [
		['../scripts/reporters/playwright-reporter.ts'],
		['html', { open: 'never', outputFolder: path.join(e2eDir, 'playwright-report') }]
	],
	outputDir: path.join(e2eDir, 'test-results'),
	timeout: isCi ? 90_000 : 60_000,
	expect: {
		timeout: 8_000
	},
	use: {
		baseURL: testEnv.baseUrl,
		actionTimeout: isCi ? 15_000 : 8_000,
		navigationTimeout: isCi ? 30_000 : 8_000,
		trace: 'retain-on-failure',
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
