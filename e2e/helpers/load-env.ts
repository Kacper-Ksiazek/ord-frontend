import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENV_FILE = resolve(fileURLToPath(new URL('../../.env.e2e', import.meta.url)));

/**
 * Loads `.env.e2e` into `process.env` without overwriting existing variables.
 *
 * Simple KEY=value parser — no quotes, `export` prefix, or variable expansion.
 */
export function loadEnvE2e(): void {
	if (!existsSync(ENV_FILE)) {
		return;
	}

	for (const line of readFileSync(ENV_FILE, 'utf8').split('\n')) {
		const trimmed = line.trim();

		if (!trimmed || trimmed.startsWith('#')) {
			continue;
		}

		const separatorIndex = trimmed.indexOf('=');

		if (separatorIndex === -1) {
			continue;
		}

		const key = trimmed.slice(0, separatorIndex).trim();
		const value = trimmed.slice(separatorIndex + 1).trim();

		if (key && process.env[key] === undefined) {
			process.env[key] = value;
		}
	}
}
