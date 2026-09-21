import { env } from '$env/dynamic/public';
import type { BrowserOptions, NodeOptions } from '@sentry/sveltekit';

export function isSentryEnabled(): boolean {
	if (env.PUBLIC_E2E === 'true') {
		return false;
	}

	return Boolean(env.PUBLIC_SENTRY_DSN?.trim());
}

export function getSentryEnvironment(): string {
	return env.PUBLIC_SENTRY_ENVIRONMENT ?? (import.meta.env.DEV ? 'development' : 'production');
}

/** Shared Sentry options — errors only, no session replay or performance tracing. */
export function getSentryOptions(): BrowserOptions & NodeOptions {
	return {
		dsn: env.PUBLIC_SENTRY_DSN,
		enabled: isSentryEnabled(),
		environment: getSentryEnvironment(),
		debug: env.PUBLIC_SENTRY_DEBUG === 'true',
		tracesSampleRate: 0
	};
}

export function shouldReportApiError(status?: number): boolean {
	if (!isSentryEnabled()) {
		return false;
	}

	// Unexpected 500s only — skip network errors (local API down) and 502 upstream noise.
	return status === 500;
}
