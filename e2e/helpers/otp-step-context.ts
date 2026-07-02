import type { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { testEnv } from '../fixtures/test-env';

let otpStepContext: BrowserContext | undefined;
let otpStepPage: Page | undefined;

/**
 * One shared browser context on the OTP step per worker.
 * Avoids repeated `otp-request` calls (backend rate limits).
 */
export async function getOtpStepPage(browser: Browser): Promise<Page> {
	if (otpStepPage && !otpStepPage.isClosed()) {
		return otpStepPage;
	}

	otpStepContext = await browser.newContext();
	otpStepPage = await otpStepContext.newPage();

	const loginPage = new LoginPage(otpStepPage);
	await loginPage.proceedToOtpStep(testEnv.testEmail);

	return otpStepPage;
}

export async function closeOtpStepContext(): Promise<void> {
	await otpStepContext?.close();
	otpStepContext = undefined;
	otpStepPage = undefined;
}
