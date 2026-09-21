import * as Sentry from '@sentry/sveltekit';
import { isSentryEnabled } from '$lib/sentry/config';

export type SentryTestTriggerResult =
	{ status: 'sent'; message: string } | { status: 'error'; message: string };

export async function triggerSentryTestError(): Promise<SentryTestTriggerResult> {
	if (!isSentryEnabled()) {
		return {
			status: 'error',
			message: 'Sentry is disabled — set PUBLIC_SENTRY_DSN in .env and restart the dev server'
		};
	}

	if (!Sentry.isEnabled()) {
		return {
			status: 'error',
			message: 'Sentry SDK is not initialized'
		};
	}

	try {
		throw new Error('Sentry test exception from ord-ui');
	} catch (error) {
		Sentry.captureException(error);
	}

	await Sentry.flush(3000);

	return {
		status: 'sent',
		message: 'Test exception captured and sent to Sentry'
	};
}
