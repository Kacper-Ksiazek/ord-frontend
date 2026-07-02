import type { Page } from '@playwright/test';
import { test, expect } from '../../fixtures/pages.fixture';
import { isE2eAuthConfigured, testEnv } from '../../fixtures/test-env';
import { resolveOtpCode, wrongOtpCode } from '../../helpers/otp';
import { closeOtpStepContext, getOtpStepPage } from '../../helpers/otp-step-context';
import { LoginPage } from '../../pages';

test.describe('Login — validation errors', () => {
	test('submit button is disabled when email has no @ symbol', async ({ loginPage }) => {
		await loginPage.goto();
		await loginPage.fillEmail('not-an-email');

		await expect(loginPage.emailSubmitButton).toBeDisabled();
	});

	test('submit button is disabled when email is cleared', async ({ loginPage }) => {
		await loginPage.goto();
		await loginPage.fillEmail('');

		await expect(loginPage.emailSubmitButton).toBeDisabled();
	});

	test.describe('OTP step', () => {
		test.describe.configure({ mode: 'serial' });

		let otpPage: Page;

		test.beforeEach(() => {
			test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
		});

		test.beforeAll(async ({ browser }) => {
			if (!isE2eAuthConfigured()) {
				return;
			}

			otpPage = await getOtpStepPage(browser);
		});

		test.afterAll(async () => {
			await closeOtpStepContext();
		});

		test('shows error for incomplete OTP on form submit', async () => {
			const loginPage = new LoginPage(otpPage);

			await loginPage.fillOtp('12');
			await expect(loginPage.otpSubmitButton).toBeDisabled();
			await loginPage.submitOtpForm();

			await expect(loginPage.errorAlert).toBeVisible();
			await expect(otpPage).toHaveURL(/\/login/);
		});

		test('shows error for incorrect OTP from API', async () => {
			const loginPage = new LoginPage(otpPage);
			const correctCode = await resolveOtpCode(testEnv.testEmail);

			await loginPage.fillOtp(wrongOtpCode(correctCode));
			await loginPage.submitOtp();

			await expect(loginPage.errorAlert).toBeVisible();
			await expect(otpPage).toHaveURL(/\/login/);
		});

		test('recovers from wrong OTP and logs in with correct code', async () => {
			const loginPage = new LoginPage(otpPage);
			const correctCode = await resolveOtpCode(testEnv.testEmail);

			await loginPage.fillOtp(wrongOtpCode(correctCode));
			await loginPage.submitOtp();
			await expect(loginPage.errorAlert).toBeVisible();

			await loginPage.fillOtp(correctCode);
			await loginPage.submitOtp();
			await loginPage.waitForLoginSuccess();
		});
	});
});
