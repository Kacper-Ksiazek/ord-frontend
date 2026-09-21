import { afterEach, describe, expect, it, vi } from 'vitest';

const { captureException, flush, isEnabled } = vi.hoisted(() => ({
	captureException: vi.fn(),
	flush: vi.fn().mockResolvedValue(true),
	isEnabled: vi.fn().mockReturnValue(true)
}));

vi.mock('@sentry/sveltekit', () => ({
	captureException,
	flush,
	isEnabled
}));

vi.mock('$lib/sentry/config', () => ({
	isSentryEnabled: vi.fn().mockReturnValue(true)
}));

import { isSentryEnabled } from '$lib/sentry/config';
import { triggerSentryTestError } from './trigger-test-error';

describe('triggerSentryTestError', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSentryEnabled).mockReturnValue(true);
		isEnabled.mockReturnValue(true);
	});

	it('captures and flushes a test exception when Sentry is enabled', async () => {
		const result = await triggerSentryTestError();

		expect(result.status).toBe('sent');
		expect(captureException).toHaveBeenCalledOnce();
		expect(flush).toHaveBeenCalledWith(3000);
	});

	it('returns an error when Sentry is disabled', async () => {
		vi.mocked(isSentryEnabled).mockReturnValue(false);

		const result = await triggerSentryTestError();

		expect(result.status).toBe('error');
		expect(captureException).not.toHaveBeenCalled();
	});
});
