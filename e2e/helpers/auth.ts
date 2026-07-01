import type { Page } from '@playwright/test';
import { testEnv } from '../fixtures/test-env';
import { resolveOtpCode } from './otp';
import { loginSelectors } from './selectors';

export async function loginViaOtp(page: Page, email = testEnv.testEmail): Promise<void> {
	await page.goto('/login');
	await page.waitForSelector(loginSelectors.emailInput);

	await page.fill(loginSelectors.emailInput, email);
	await page.click(loginSelectors.emailSubmitButton);

	await page.waitForSelector(loginSelectors.otpGroup);

	const otpCode = await resolveOtpCode(email);

	for (let i = 0; i < 6; i++) {
		await page.fill(loginSelectors.otpDigit(i + 1), otpCode[i]!);
	}

	await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
}

export async function logoutViaSidebar(page: Page): Promise<void> {
	const logoutButton = page.locator('button[title="Logout"]');
	await logoutButton.click();
	await page.waitForURL('**/login');
}
