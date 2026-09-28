import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_E2E: undefined,
		PUBLIC_SENTRY_DSN: 'https://example.ingest.sentry.io/123',
		PUBLIC_SENTRY_ENVIRONMENT: 'development',
		PUBLIC_SENTRY_DEBUG: undefined
	}
}));

import { isSentryEnabled } from './config';

describe('sentry config', () => {
	afterEach(() => {
		vi.resetModules();
	});

	it('is disabled when environment is development', () => {
		expect(isSentryEnabled()).toBe(false);
	});

	it('is enabled for production environment when DSN is set', async () => {
		vi.doMock('$env/dynamic/public', () => ({
			env: {
				PUBLIC_E2E: undefined,
				PUBLIC_SENTRY_DSN: 'https://example.ingest.sentry.io/123',
				PUBLIC_SENTRY_ENVIRONMENT: 'production',
				PUBLIC_SENTRY_DEBUG: undefined
			}
		}));
		const { isSentryEnabled: isEnabled } = await import('./config');
		expect(isEnabled()).toBe(import.meta.env.DEV ? false : true);
	});

	it('reports API 500 only when Sentry is enabled', async () => {
		vi.doMock('$env/dynamic/public', () => ({
			env: {
				PUBLIC_E2E: undefined,
				PUBLIC_SENTRY_DSN: 'https://example.ingest.sentry.io/123',
				PUBLIC_SENTRY_ENVIRONMENT: 'production',
				PUBLIC_SENTRY_DEBUG: undefined
			}
		}));
		const { shouldReportApiError: reportApiError } = await import('./config');
		if (import.meta.env.DEV) {
			expect(reportApiError(500)).toBe(false);

			return;
		}
		expect(reportApiError(500)).toBe(true);
		expect(reportApiError(502)).toBe(false);
		expect(reportApiError(undefined)).toBe(false);
		expect(reportApiError(401)).toBe(false);
		expect(reportApiError(400)).toBe(false);
	});
});
