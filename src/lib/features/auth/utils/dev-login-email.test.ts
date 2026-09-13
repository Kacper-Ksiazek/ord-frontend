import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({
	dev: true
}));

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_DEV_LOGIN_EMAIL: 'dev@example.com',
		PUBLIC_DEV_LOGIN_OTP: '654321'
	}
}));

describe('dev-login-email', () => {
	afterEach(() => {
		vi.resetModules();
	});

	it('returns empty credentials when PUBLIC_E2E is set', async () => {
		vi.doMock('$env/dynamic/public', () => ({
			env: {
				PUBLIC_E2E: 'true',
				PUBLIC_DEV_LOGIN_EMAIL: 'dev@example.com',
				PUBLIC_DEV_LOGIN_OTP: '654321'
			}
		}));

		const { getDevLoginEmail, getDevLoginOtp } = await import('./dev-login-email');

		expect(getDevLoginEmail()).toBe('');
		expect(getDevLoginOtp()).toBe('');
	});

	it('returns dev credentials in local development', async () => {
		vi.doMock('$env/dynamic/public', () => ({
			env: {
				PUBLIC_DEV_LOGIN_EMAIL: 'dev@example.com',
				PUBLIC_DEV_LOGIN_OTP: '654321'
			}
		}));

		const { getDevLoginEmail, getDevLoginOtp } = await import('./dev-login-email');

		expect(getDevLoginEmail()).toBe('dev@example.com');
		expect(getDevLoginOtp()).toBe('654321');
	});
});
