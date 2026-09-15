import { expect, type Locator, type Page } from '@playwright/test';

export async function clickTtsAndWaitForSpeak(page: Page, button: Locator): Promise<void> {
	await expect(button).toBeVisible();
	await expect(button).toBeEnabled();

	const ttsResponse = page.waitForResponse(
		(response) =>
			response.request().method() === 'POST' && response.url().includes('/api/v1/tts/speak'),
		{ timeout: 30_000 }
	);

	await button.click();

	const response = await ttsResponse;

	if (!response.ok()) {
		const body = await response.text();

		throw new Error(`TTS speak failed (${response.status()}): ${body}`);
	}
}
