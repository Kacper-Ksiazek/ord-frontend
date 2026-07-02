import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Browser, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { isE2eAuthConfigured, testEnv } from '../fixtures/test-env';

const e2eDir = path.dirname(fileURLToPath(new URL('../', import.meta.url)));
export const AUTH_STORAGE_PATH = path.join(e2eDir, '.auth', 'storage.json');

export function ensureAuthStorageDir(): void {
	mkdirSync(path.dirname(AUTH_STORAGE_PATH), { recursive: true });
}

export async function saveAuthStorage(context: BrowserContext): Promise<void> {
	ensureAuthStorageDir();
	await context.storageState({ path: AUTH_STORAGE_PATH });
}

export async function createAuthStorage(browser: Browser): Promise<string> {
	if (!isE2eAuthConfigured()) {
		throw new Error('E2E_OTP_CODE or E2E_OTP_FETCH_URL required to create auth storage');
	}

	ensureAuthStorageDir();

	const context = await browser.newContext();
	const page = await context.newPage();
	const loginPage = new LoginPage(page);

	await loginPage.loginWithOtp(testEnv.testEmail);
	await saveAuthStorage(context);
	await context.close();

	return AUTH_STORAGE_PATH;
}

export async function resolveAuthStoragePath(browser: Browser): Promise<string> {
	if (existsSync(AUTH_STORAGE_PATH)) {
		return AUTH_STORAGE_PATH;
	}

	return createAuthStorage(browser);
}
