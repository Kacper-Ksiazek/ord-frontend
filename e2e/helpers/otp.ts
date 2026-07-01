import { testEnv } from '../fixtures/test-env';

type OtpFetchResponse = {
	code?: string;
	otp?: string;
};

/**
 * Resolves the OTP code for E2E login.
 *
 * Priority:
 * 1. `E2E_OTP_CODE` — fixed code from test backend
 * 2. `E2E_OTP_FETCH_URL` — HTTP endpoint returning `{ code }` or `{ otp }`
 */
export async function resolveOtpCode(email: string): Promise<string> {
	if (testEnv.otpCode) {
		return testEnv.otpCode;
	}

	if (testEnv.otpFetchUrl) {
		const url = new URL(testEnv.otpFetchUrl);
		url.searchParams.set('email', email);

		const response = await fetch(url.toString());

		if (!response.ok) {
			throw new Error(
				`Failed to fetch OTP from ${testEnv.otpFetchUrl}: ${response.status} ${response.statusText}`
			);
		}

		const data = (await response.json()) as OtpFetchResponse;
		const code = data.code ?? data.otp;

		if (!code || code.length !== 6) {
			throw new Error(`OTP fetch endpoint returned invalid code for ${email}`);
		}

		return code;
	}

	throw new Error(
		'E2E auth is not configured. Set E2E_OTP_CODE or E2E_OTP_FETCH_URL in .env.e2e'
	);
}

/** Returns a 6-digit OTP code guaranteed to differ from the correct one. */
export function wrongOtpCode(correctCode: string): string {
	if (correctCode.length !== 6) {
		throw new Error('OTP code must be 6 digits');
	}

	const digits = correctCode.split('');
	const lastDigit = Number(digits[5]);
	digits[5] = String((lastDigit + 1) % 10);

	return digits.join('');
}
