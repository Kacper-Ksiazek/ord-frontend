import type { Locator, Page } from '@playwright/test';
import { E2E_TEST_IDS } from '../helpers/test-ids';
import { resolveOtpCode } from '../helpers/otp';

export class LoginPage {
	readonly path = '/login';

	readonly emailInput: Locator;
	readonly emailSubmitButton: Locator;
	readonly otpGroup: Locator;
	readonly otpSubmitButton: Locator;

	constructor(protected readonly page: Page) {
		this.emailInput = page.getByTestId(E2E_TEST_IDS.login.emailInput);
		this.emailSubmitButton = page.getByTestId(E2E_TEST_IDS.login.emailSubmit);
		this.otpGroup = page.getByTestId(E2E_TEST_IDS.login.otpInput);
		this.otpSubmitButton = page.getByTestId(E2E_TEST_IDS.login.otpSubmit);
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

		const otpDigitPrefix = E2E_TEST_IDS.login.otpDigit(1).replace(/\d$/, '');

		// Headless runs faster than Svelte bindable/effect flush — wait until digits are synced.
		await this.page.waitForFunction(
			({ expectedValue, digitPrefix }) => {
				const inputs = document.querySelectorAll<HTMLInputElement>(`[data-testid^="${digitPrefix}"]`);
				const value = Array.from(inputs)
					.sort(
						(a, b) =>
							Number(a.dataset.testid?.replace(digitPrefix, '')) -
							Number(b.dataset.testid?.replace(digitPrefix, ''))
					)
					.map((input) => input.value)
					.join('');

				return value === expectedValue;
			},
			{ expectedValue: expected, digitPrefix: otpDigitPrefix }
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
		// Login screen calls goto('/'); `(private)/+page.ts` redirects to `/conversations`.
		// Predicate form is reliable for SvelteKit client-side (pushState) navigation.
		await this.page.waitForURL((url) => url.pathname === '/conversations' || url.pathname === '/', {
			timeout: 15_000
		});
	}
}
