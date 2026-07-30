import { loadEnvE2e } from '@e2e/shared/helpers/load-env';

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
	/** Fallback when not using per-worker mapping (workers: 1). */
	get testEmail() {
		return requireEnv('E2E_TEST_EMAIL') ?? workerEmail(0);
	},
	get otpCode() {
		return requireEnv('E2E_OTP_CODE');
	},
	get otpFetchUrl() {
		return requireEnv('E2E_OTP_FETCH_URL');
	},
	get workerCount() {
		const raw = requireEnv('E2E_WORKER_COUNT');

		return raw ? Number.parseInt(raw, 10) : 4;
	},
	get emailPrefix() {
		return requireEnv('E2E_EMAIL_PREFIX') ?? 'e2e-ci-w';
	},
	get emailDomain() {
		return requireEnv('E2E_EMAIL_DOMAIN') ?? 'ord.test';
	}
};

export function workerEmail(workerIndex: number): string {
	const bounded = workerIndex % testEnv.workerCount;

	return `${testEnv.emailPrefix}${bounded}@${testEnv.emailDomain}`;
}

export function isE2eAuthConfigured(): boolean {
	return Boolean(testEnv.otpCode || testEnv.otpFetchUrl);
}
