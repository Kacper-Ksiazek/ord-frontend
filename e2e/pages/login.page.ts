import type { Locator, Page } from '@playwright/test';
import { resolveOtpCode } from '../helpers/otp';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
	readonly path = '/login';

	readonly emailInput: Locator;
	readonly emailSubmitButton: Locator;
	readonly otpGroup: Locator;
	readonly otpSubmitButton: Locator;
	readonly errorAlert: Locator;

	constructor(page: Page) {
		super(page);

		this.emailInput = page.locator('#email');
		this.emailSubmitButton = page.locator('form:has(#email) button[type="submit"]');
		this.otpGroup = page.locator('[aria-label="OTP Input"]');
		this.otpSubmitButton = page.locator('form:has([aria-label="OTP Input"]) button[type="submit"]');
		this.errorAlert = page.locator('[role="alert"]');
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
			await this.otpDigit(i + 1).fill(code[i]!);
		}
	}

	async submitOtp(): Promise<void> {
		await this.otpSubmitButton.click();
	}

	async loginWithOtp(email: string, otpCode?: string): Promise<void> {
		const code = otpCode ?? (await resolveOtpCode(email));

		await this.proceedToOtpStep(email);
		await this.fillOtp(code);
		await this.waitForLoginSuccess();
	}

	async waitForLoginSuccess(): Promise<void> {
		await this.page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
	}
}
