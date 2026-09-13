import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

function isE2eRuntime(): boolean {
	return env.PUBLIC_E2E === 'true';
}

export function getDevLoginEmail(): string {
	if (!dev || isE2eRuntime()) {
		return '';
	}

	return env.PUBLIC_DEV_LOGIN_EMAIL?.trim() ?? '';
}

export function getDevLoginOtp(): string {
	if (!dev || isE2eRuntime() || !getDevLoginEmail()) {
		return '';
	}

	return env.PUBLIC_DEV_LOGIN_OTP?.trim() || '123456';
}
