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
		await this.emailInput.waitFor();
	}

	async fillEmail(email: string): Promise<void> {
		await this.emailInput.click();
		await this.emailInput.pressSequentially(email, { delay: 20 });
		await expect(this.emailInput).toHaveValue(email);
		await expect(this.emailSubmitButton).toBeEnabled({ timeout: 15_000 });
	}

	async submitEmail(): Promise<void> {
		await this.emailSubmitButton.click();
	}

	async proceedToOtpStep(email: string, options?: { assumeOnLoginPage?: boolean }): Promise<void> {
		if (options?.assumeOnLoginPage) {
			await this.emailInput.waitFor();
		} else {
			await this.goto();
		}

		await this.fillEmail(email);
		await this.submitEmail();
		await this.otpGroup.waitFor({ state: 'visible' });
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

	private async clearOtpDigits(): Promise<void> {
		const current = await this.readOtpDigitValues();

		if (current.length === 0) {
			return;
		}

		await this.otpDigit(6).click();

		for (let i = 0; i < current.length; i++) {
			await this.page.keyboard.press('Backspace');
		}

		await expect(this.otpSubmitButton).toBeDisabled();
	}

	async fillOtp(code: string): Promise<void> {
		await this.clearOtpDigits();
		await this.otpDigit(1).click();
		await this.otpDigit(1).evaluate((input, otp) => {
			const clipboardData = new DataTransfer();
			clipboardData.setData('text/plain', otp);
			input.dispatchEvent(
				new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true })
			);
		}, code);

		await expect.poll(() => this.readOtpDigitValues(), { timeout: 15_000 }).toBe(code);
		await expect(this.otpSubmitButton).toBeEnabled({ timeout: 15_000 });
	}

	async submitOtp(): Promise<void> {
		await expect(this.otpSubmitButton).toBeEnabled({ timeout: 15_000 });
		await this.otpSubmitButton.click();
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
