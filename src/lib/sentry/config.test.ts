import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_E2E: undefined,
		PUBLIC_SENTRY_DSN: 'https://example.ingest.sentry.io/123',
		PUBLIC_SENTRY_ENVIRONMENT: undefined,
		PUBLIC_SENTRY_DEBUG: undefined
	}
}));

import { isSentryEnabled, shouldReportApiError } from './config';

describe('sentry config', () => {
	afterEach(() => {
		vi.resetModules();
	});

	it('is enabled when DSN is set and E2E is off', () => {
		expect(isSentryEnabled()).toBe(true);
	});

	it('reports API 500 only', () => {
		expect(shouldReportApiError(500)).toBe(true);
		expect(shouldReportApiError(502)).toBe(false);
		expect(shouldReportApiError(undefined)).toBe(false);
		expect(shouldReportApiError(401)).toBe(false);
		expect(shouldReportApiError(400)).toBe(false);
	});
});
