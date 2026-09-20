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
		await this.page.goto(this.path);
		await this.emailInput.waitFor();
	}

	async fillEmail(email: string): Promise<void> {
		await this.emailInput.click();
		await this.emailInput.pressSequentially(email, { delay: 20 });
		await expect(this.emailInput).toHaveValue(email);
		await expect(this.emailSubmitButton).toBeEnabled();
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

	private async clearOtpDigits(): Promise<void> {
		await this.otpDigit(6).click();

		for (let i = 0; i < 6; i++) {
			await this.page.keyboard.press('Backspace');
		}
	}

	async fillOtp(code: string): Promise<void> {
		await this.clearOtpDigits();
		await this.otpDigit(1).click();
		await this.page.keyboard.type(code, { delay: 20 });

		// Wait until Svelte bindable otpCode enables verify — DOM .fill() alone is not enough.
		await this.page.waitForFunction((testId) => {
			const button = document.querySelector(`[data-testid="${testId}"]`) as HTMLButtonElement | null;

			return button !== null && !button.disabled;
		}, E2E_TEST_IDS.login.otpSubmit);
	}

	async submitOtp(): Promise<void> {
		await this.otpSubmitButton.click();
	}

	async loginWithOtp(email: string, otpCode?: string): Promise<void> {
		await this.proceedToOtpStep(email);
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
