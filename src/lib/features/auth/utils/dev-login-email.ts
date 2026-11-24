import { dev } from '$app/env';
import { PUBLIC_DEV_LOGIN_EMAIL, PUBLIC_DEV_LOGIN_OTP, PUBLIC_E2E } from '$app/env/public';

function isE2eRuntime(): boolean {
	return PUBLIC_E2E === 'true';
}

export function getDevLoginEmail(): string {
	if (!dev || isE2eRuntime()) {
		return '';
	}

	return PUBLIC_DEV_LOGIN_EMAIL?.trim() ?? '';
}

export function getDevLoginOtp(): string {
	if (!dev || isE2eRuntime() || !getDevLoginEmail()) {
		return '';
	}

	return PUBLIC_DEV_LOGIN_OTP?.trim() || '123456';
}
