import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENV_FILE = resolve(fileURLToPath(new URL('../../.env.e2e', import.meta.url)));

/**
 * Loads `.env.e2e` into `process.env` via dotenv.
 * Existing process.env values are not overwritten (dotenv default).
 */
export function loadEnvE2e(): void {
	config({ path: ENV_FILE });
}
