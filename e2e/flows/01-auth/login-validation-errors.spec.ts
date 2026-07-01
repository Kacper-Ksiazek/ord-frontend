import { test, expect } from '@playwright/test';
import { isE2eAuthConfigured, testEnv } from '../../fixtures/test-env';
import { loginViaOtp } from '../../helpers/auth';
import { loginSelectors } from '../../helpers/selectors';
import { resolveOtpCode } from '../../helpers/otp';

test.describe('Login — validation errors', () => {
	test('submit button is disabled when email has no @ symbol', async ({ page }) => {
		await page.goto('/login');

		await page.fill(loginSelectors.emailInput, 'not-an-email');

		await expect(page.locator(loginSelectors.emailSubmitButton)).toBeDisabled();
	});

	test('submit button is disabled when email is empty', async ({ page }) => {
		await page.goto('/login');

		await expect(page.locator(loginSelectors.emailSubmitButton)).toBeDisabled();
	});

	test.describe('OTP step', () => {
		test.beforeEach(() => {
			test.skip(!isE2eAuthConfigured(), 'E2E_OTP_CODE or E2E_OTP_FETCH_URL required');
		});

		test.beforeEach(async ({ page }) => {
			await page.goto('/login');
			await page.fill(loginSelectors.emailInput, testEnv.testEmail);
			await page.click(loginSelectors.emailSubmitButton);
			await page.waitForSelector(loginSelectors.otpGroup);
		});

		test('shows error for incomplete OTP on manual submit', async ({ page }) => {
			await page.fill(loginSelectors.otpDigit(1), '1');
			await page.fill(loginSelectors.otpDigit(2), '2');
			await page.click(loginSelectors.otpSubmitButton);

			await expect(page.locator(loginSelectors.errorAlert)).toBeVisible();
			await expect(page).toHaveURL(/\/login/);
		});

		test('shows error for incorrect OTP from API', async ({ page }) => {
			const wrongCode = '999999';

			for (let i = 0; i < 6; i++) {
				await page.fill(loginSelectors.otpDigit(i + 1), wrongCode[i]!);
			}

			await page.click(loginSelectors.otpSubmitButton);

			await expect(page.locator(loginSelectors.errorAlert)).toBeVisible();
			await expect(page).toHaveURL(/\/login/);
		});

		test('recovers from wrong OTP and logs in with correct code', async ({ page }) => {
			for (let i = 0; i < 6; i++) {
				await page.fill(loginSelectors.otpDigit(i + 1), '9');
			}

			await page.click(loginSelectors.otpSubmitButton);
			await expect(page.locator(loginSelectors.errorAlert)).toBeVisible();

			const correctCode = await resolveOtpCode(testEnv.testEmail);

			for (let i = 0; i < 6; i++) {
				await page.fill(loginSelectors.otpDigit(i + 1), correctCode[i]!);
			}

			await page.click(loginSelectors.otpSubmitButton);
			await page.waitForURL((url) => !url.pathname.startsWith('/login'));
		});
	});
});
