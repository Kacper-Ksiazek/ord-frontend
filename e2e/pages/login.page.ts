import type { Locator, Page } from '@playwright/test';
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
		this.emailInput = page.locator('#email');
		this.emailSubmitButton = page.locator('form:has(#email) button[type="submit"]');
		this.otpGroup = page.locator('[aria-label="OTP Input"]');
		this.otpForm = page.locator('form:has([aria-label="OTP Input"])');
		this.otpSubmitButton = this.otpForm.locator('button[type="submit"]');
		this.errorAlert = page.getByText(/^(Error:|Błąd:|Fehler:)/);
	}

	otpDigit(index: number): Locator {
		return this.page.locator(`[aria-label="Digit ${index}"]`);
	}

	async goto(): Promise<void> {
		await this.page.goto(this.path);
		await this.emailInput.waitFor();
	}

	async fillEmail(email: string): Promise<void> {
		await this.emailInput.fill(email);
	}

	async submitEmail(): Promise<void> {
		await this.emailSubmitButton.click();
	}

	async proceedToOtpStep(email: string): Promise<void> {
		await this.goto();
		await this.fillEmail(email);
		await this.submitEmail();
		await this.otpGroup.waitFor();
	}

	async fillOtp(code: string): Promise<void> {
		for (let i = 0; i < 6; i++) {
			await this.otpDigit(i + 1).fill(code[i] ?? '');
		}
	}

	async submitOtp(): Promise<void> {
		await this.otpSubmitButton.click();
	}

	/**
	 * Dispatches a form submit event — used when the submit button is disabled
	 * but client-side validation should still run (e.g. incomplete OTP).
	 */
	async submitOtpForm(): Promise<void> {
		await this.otpForm.evaluate((form) => {
			form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		});
	}

	async loginWithOtp(email: string, otpCode?: string): Promise<void> {
		const code = otpCode ?? (await resolveOtpCode(email));

		await this.proceedToOtpStep(email);
		await this.fillOtp(code);
		await this.submitOtp();
		await this.waitForLoginSuccess();
	}

	async waitForLoginSuccess(): Promise<void> {
		await this.page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
	}
}
