import {
	PUBLIC_E2E,
	PUBLIC_SENTRY_DEBUG,
	PUBLIC_SENTRY_DSN,
	PUBLIC_SENTRY_ENVIRONMENT
} from '$app/env/public';
import type { BrowserOptions, NodeOptions } from '@sentry/sveltekit';

export function isSentryEnabled(): boolean {
	if (PUBLIC_E2E === 'true') {
		return false;
	}

	if (!PUBLIC_SENTRY_DSN?.trim()) {
		return false;
	}

	// Vite dev server (localhost) and explicit development environment — no Sentry noise.
	if (import.meta.env.DEV || getSentryEnvironment() === 'development') {
		return false;
	}

	return true;
}

export function getSentryEnvironment(): string {
	return PUBLIC_SENTRY_ENVIRONMENT ?? (import.meta.env.DEV ? 'development' : 'production');
}

/** Shared Sentry options — errors only, no session replay or performance tracing. */
export function getSentryOptions(): BrowserOptions & NodeOptions {
	return {
		dsn: PUBLIC_SENTRY_DSN,
		enabled: isSentryEnabled(),
		environment: getSentryEnvironment(),
		debug: PUBLIC_SENTRY_DEBUG === 'true',
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
