import { loadEnvE2e } from '../helpers/load-env';

loadEnvE2e();

function requireEnv(name: string): string | undefined {
	const value = process.env[name];
	return value && value.length > 0 ? value : undefined;
}

export const testEnv = {
	get baseUrl() {
		return requireEnv('E2E_BASE_URL') ?? 'http://localhost:5173';
	},
	get apiUrl() {
		return requireEnv('E2E_API_URL') ?? requireEnv('PUBLIC_API_URL') ?? 'http://localhost:8080';
	},
	get testEmail() {
		return requireEnv('E2E_TEST_EMAIL') ?? 'e2e-test@example.com';
	},
	get otpCode() {
		return requireEnv('E2E_OTP_CODE');
	},
	get otpFetchUrl() {
		return requireEnv('E2E_OTP_FETCH_URL');
	}
};

export function isE2eAuthConfigured(): boolean {
	return Boolean(testEnv.otpCode || testEnv.otpFetchUrl);
}
