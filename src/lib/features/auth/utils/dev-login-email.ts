import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

export function getDevLoginEmail(): string {
	if (!dev) {
		return '';
	}

	return env.PUBLIC_DEV_LOGIN_EMAIL?.trim() ?? '';
}
