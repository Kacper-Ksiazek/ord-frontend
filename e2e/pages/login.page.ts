import type { Locator, Page } from '@playwright/test';
import { E2E_TEST_IDS } from '../helpers/test-ids';
import { resolveOtpCode } from '../helpers/otp';

export class LoginPage {
	readonly path = '/login';

	readonly emailInput: Locator;
	readonly emailSubmitButton: Locator;
	readonly otpGroup: Locator;
	readonly otpForm: Locator;
	readonly otpSubmitButton: Locator;
	readonly errorAlert: Locator;

	constructor(protected readonly page: Page) {
		this.emailInput = page.getByTestId(E2E_TEST_IDS.login.emailInput);
		this.emailSubmitButton = page.getByTestId(E2E_TEST_IDS.login.emailSubmit);
		this.otpGroup = page.getByTestId(E2E_TEST_IDS.login.otpInput);
		this.otpForm = page.getByTestId(E2E_TEST_IDS.login.otpForm);
		this.otpSubmitButton = page.getByTestId(E2E_TEST_IDS.login.otpSubmit);
		this.errorAlert = page.getByTestId(E2E_TEST_IDS.login.error);
	}

	otpDigit(index: number): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.login.otpDigit(index));
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
		await this.emailInput.waitFor();
	}

	async fillEmail(email: string): Promise<void> {
		await this.emailInput.clear();
		await this.emailInput.fill(email);
	}

	async submitEmail(): Promise<void> {
		await this.emailSubmitButton.click();
	}

	async proceedToOtpStep(email: string): Promise<void> {
		await this.goto();
		await this.fillEmail(email);
		await this.submitEmail();
		await this.otpGroup.waitFor({ state: 'visible' });
	}

	async fillOtp(code: string): Promise<void> {
		const expected = Array.from({ length: 6 }, (_, i) => code[i] ?? '').join('');

		for (let i = 0; i < 6; i++) {
			await this.otpDigit(i + 1).fill(code[i] ?? '');
		}

		// Headless runs faster than Svelte bindable/effect flush — wait until digits are synced.
		await this.page.waitForFunction(
			(expectedValue) => {
				const inputs = document.querySelectorAll<HTMLInputElement>(
					'[data-testid^="login-otp-digit-"]'
				);
				const value = Array.from(inputs)
					.sort(
						(a, b) =>
							Number(a.dataset.testid?.replace('login-otp-digit-', '')) -
							Number(b.dataset.testid?.replace('login-otp-digit-', ''))
					)
					.map((input) => input.value)
					.join('');

				return value === expectedValue;
			},
			expected
		);
	}

	async submitOtp(): Promise<void> {
		await this.otpSubmitButton.click();
	}

	async loginWithOtp(email: string, otpCode?: string): Promise<void> {
		const code = otpCode ?? (await resolveOtpCode(email));

		await this.proceedToOtpStep(email);
		await this.fillOtp(code);
		await this.submitOtp();
		await this.waitForLoginSuccess();
	}

	async waitForLoginSuccess(): Promise<void> {
		// App redirects to `/` after OTP verify (placeholder home), not `/conversations`.
		await this.page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
	}
}
