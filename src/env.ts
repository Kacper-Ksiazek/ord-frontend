import { defineEnvVars } from '@sveltejs/kit/env';

/** Keeps an unset or blank variable optional instead of failing startup. */
const optional = (value: string | undefined) => value;

/**
 * Environment variables for `$app/env/public` (SvelteKit 3 replaced the `$env/*` modules).
 * All of them are public: the browser reads them.
 */
export const variables = defineEnvVars({
	PUBLIC_API_URL: {
		public: true,
		static: true,
		description: 'Base URL of the ord-api backend'
	},
	PUBLIC_SENTRY_DSN: {
		public: true,
		schema: optional,
		description: 'Sentry DSN; Sentry stays off when unset'
	},
	PUBLIC_SENTRY_ENVIRONMENT: {
		public: true,
		schema: optional,
		description: 'Sentry environment name; defaults from the Vite mode'
	},
	PUBLIC_SENTRY_DEBUG: {
		public: true,
		schema: optional,
		description: "Set to 'true' to enable Sentry debug logging"
	},
	PUBLIC_E2E: {
		public: true,
		schema: optional,
		description: "Set to 'true' in Playwright runs to disable Sentry and dev login prefill"
	},
	PUBLIC_DEV_LOGIN_EMAIL: {
		public: true,
		schema: optional,
		description: 'Dev-only login email prefill'
	},
	PUBLIC_DEV_LOGIN_OTP: {
		public: true,
		schema: optional,
		description: "Dev-only OTP prefill; defaults to '123456'"
	}
});
