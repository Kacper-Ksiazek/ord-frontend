/** E2E test IDs for the auth feature — used in Svelte markup and Playwright page objects. */
export const E2E_TEST_IDS = {
	login: {
		page: 'login-page',
		emailForm: 'login-email-form',
		emailInput: 'login-email-input',
		emailSubmit: 'login-email-submit',
		otpForm: 'login-otp-form',
		otpInput: 'login-otp-input',
		otpSubmit: 'login-otp-submit',
		error: 'login-error',
		otpDigit: (index: number) => `login-otp-digit-${index}`
	}
} as const;
