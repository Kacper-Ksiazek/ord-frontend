import { chromium, type FullConfig } from '@playwright/test';

/**
 * First Vite request compiles the SvelteKit app. On GitHub Actions that exceeds
 * the 8s navigationTimeout used by the first login specs.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
	const baseURL = config.projects[0]?.use.baseURL ?? 'http://localhost:5173';
	const browser = await chromium.launch();
	const page = await browser.newPage();

	for (const route of ['/conversations', '/login']) {
		await page.goto(new URL(route, baseURL).href, {
			timeout: 60_000,
			waitUntil: 'domcontentloaded'
		});
	}

	await browser.close();
}
