import * as Sentry from '@sentry/sveltekit';
import { getSentryOptions } from '$lib/sentry/config';

Sentry.init(getSentryOptions());
