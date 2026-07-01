function requireEnv(name: string): string | undefined {
	const value = process.env[name];
	return value && value.length > 0 ? value : undefined;
}

export const testEnv = {
	baseUrl: requireEnv('E2E_BASE_URL') ?? 'http://localhost:5173',
	apiUrl:
		requireEnv('E2E_API_URL') ?? requireEnv('PUBLIC_API_URL') ?? 'http://localhost:8080',
	testEmail: requireEnv('E2E_TEST_EMAIL') ?? 'e2e-test@example.com',
	/** Fixed OTP code for test backend (e.g. always `000000` in dev). */
	otpCode: requireEnv('E2E_OTP_CODE'),
	/** Optional URL that returns the latest OTP for `E2E_TEST_EMAIL` (JSON: `{ "code": "123456" }`). */
	otpFetchUrl: requireEnv('E2E_OTP_FETCH_URL')
} as const;

export function isE2eAuthConfigured(): boolean {
	return Boolean(testEnv.otpCode || testEnv.otpFetchUrl);
}
