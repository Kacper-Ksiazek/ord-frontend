import { expect, type Locator, type Page } from '@playwright/test';
import { E2E_TEST_IDS } from '@e2e/auth/test-ids';
import { resolveOtpCode } from '@e2e/shared/helpers/otp';

export class LoginPage {
	readonly path = '/login';

	readonly emailInput: Locator;
	readonly emailSubmitButton: Locator;
	readonly otpGroup: Locator;
	readonly otpSubmitButton: Locator;
	readonly error: Locator;

	constructor(protected readonly page: Page) {
		this.emailInput = page.getByTestId(E2E_TEST_IDS.login.emailInput);
		this.emailSubmitButton = page.getByTestId(E2E_TEST_IDS.login.emailSubmit);
		this.otpGroup = page.getByTestId(E2E_TEST_IDS.login.otpInput);
		this.otpSubmitButton = page.getByTestId(E2E_TEST_IDS.login.otpSubmit);
		this.error = page.getByTestId(E2E_TEST_IDS.login.error);
	}

	otpDigit(index: number): Locator {
		return this.page.getByTestId(E2E_TEST_IDS.login.otpDigit(index));
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });

		// Serial auth tests can land on /login still on the OTP step — reload to reset form state.
		if (await this.otpGroup.isVisible()) {
			await this.page.reload({ waitUntil: 'domcontentloaded' });
		} else if (!(await this.emailInput.isVisible())) {
			await this.page.reload({ waitUntil: 'domcontentloaded' });
		}

		await this.emailInput.waitFor({ state: 'visible' });
	}

	async fillEmail(email: string): Promise<void> {
		await this.emailInput.click();
		await this.emailInput.fill(email);
		await expect(this.emailInput).toHaveValue(email);
	}

	async submitEmail(): Promise<void> {
		await this.emailInput.press('Enter');
	}

	private waitForOtpRequestResponse() {
		return this.page.waitForResponse(
			(response) =>
				response.url().includes('/api/v1/auth/otp-request') && response.request().method() === 'POST',
			{ timeout: 30_000 }
		);
	}

	private async requestOtpForEmail(
		email: string,
		options?: { assumeOnLoginPage?: boolean }
	): Promise<void> {
		if (options?.assumeOnLoginPage) {
			if (await this.otpGroup.isVisible()) {
				await this.goto();
			} else {
				await this.emailInput.waitFor({ state: 'visible' });
			}
		} else {
			await this.goto();
		}

		await this.fillEmail(email);

		const otpResponse = this.waitForOtpRequestResponse();
		await Promise.all([
			otpResponse,
			this.otpGroup.waitFor({ state: 'visible', timeout: 30_000 }),
			this.submitEmail()
		]);

		const response = await otpResponse;

		if (!response.ok()) {
			throw new Error(`OTP request failed (${response.status()}): ${await response.text()}`);
		}
	}

	async proceedToOtpStep(email: string, options?: { assumeOnLoginPage?: boolean }): Promise<void> {
		try {
			await this.requestOtpForEmail(email, options);
		} catch {
			await this.goto();
			await this.requestOtpForEmail(email, { assumeOnLoginPage: true });
		}
	}

	private otpDigitPrefix(): string {
		return E2E_TEST_IDS.login.otpDigit(1).replace(/\d$/, '');
	}

	private async readOtpDigitValues(): Promise<string> {
		const digitPrefix = this.otpDigitPrefix();

		return this.page.evaluate((prefix) => {
			const inputs = document.querySelectorAll<HTMLInputElement>(`[data-testid^="${prefix}"]`);

			return Array.from(inputs)
				.sort(
					(a, b) =>
						Number(a.dataset.testid?.replace(prefix, '')) - Number(b.dataset.testid?.replace(prefix, ''))
				)
				.map((input) => input.value)
				.join('');
		}, digitPrefix);
	}

	private async typeOtpDigitByDigit(code: string): Promise<void> {
		for (let i = 0; i < 6; i++) {
			const digit = code[i] ?? '';
			await this.otpDigit(i + 1).click();
			await this.page.keyboard.press(digit);
		}
	}

	private async clearOtpDigits(): Promise<void> {
		await this.otpDigit(6).click();

		for (let attempt = 0; attempt < 6; attempt++) {
			const current = await this.readOtpDigitValues();

			if (current.length === 0) {
				return;
			}

			await this.page.keyboard.press('Backspace');
		}
	}

	async fillOtp(code: string): Promise<void> {
		await this.clearOtpDigits();
		await this.typeOtpDigitByDigit(code);
	}

	async submitOtp(): Promise<void> {
		// OtpInput submits via oncomplete (Enter) — do not rely on verify button enabled state.
		await this.otpDigit(6).press('Enter');
	}

	async loginWithOtp(
		email: string,
		otpCode?: string,
		options?: { assumeOnLoginPage?: boolean }
	): Promise<void> {
		await this.proceedToOtpStep(email, options);
		const code = otpCode ?? (await resolveOtpCode(email));
		await this.fillOtp(code);
		await this.submitOtp();
		await this.waitForLoginSuccess();
	}

	async waitForLoginSuccess(): Promise<void> {
		// Login screen calls goto('/'); `(private)/+page.ts` redirects to `/conversations`.
		// Wait for the final route — `/` matches too early and races the private layout.
		await this.page.waitForURL((url) => url.pathname === '/conversations');
	}

	async expectErrorVisible(): Promise<void> {
		await expect(this.error).toBeVisible();
	}
}

export function createLoginPage(page: Page): LoginPage {
	return new LoginPage(page);
}
