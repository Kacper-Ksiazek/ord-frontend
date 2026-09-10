import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(fileURLToPath(new URL('../../../', import.meta.url)));
const ENV_E2E_FILE = resolve(REPO_ROOT, '.env.e2e');
const ENV_DEV_FILE = resolve(REPO_ROOT, '.env');

/**
 * Loads `.env.e2e` into `process.env` via dotenv.
 * Existing process.env values are not overwritten (dotenv default).
 */
export function loadEnvE2e(): void {
	config({ path: ENV_E2E_FILE });
}

/**
 * Loads `.env` for Playwright journeys against the local dev stack.
 * Existing process.env values are not overwritten (dotenv default).
 */
export function loadEnvDev(): void {
	config({ path: ENV_DEV_FILE });
}
