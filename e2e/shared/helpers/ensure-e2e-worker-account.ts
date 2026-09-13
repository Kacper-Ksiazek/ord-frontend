import type { Page } from '@playwright/test';
import { testEnv, workerEmail } from '@e2e/shared/fixtures/test-env';

type MeResponse = {
	isAccountInitialized?: boolean;
	selectedLearningLanguage?: string | null;
};

const E2E_INIT_ACCOUNT_BODY = {
	name: 'E2E Worker',
	nativeLanguage: 'POLISH',
	selectedLearningLanguage: 'ENGLISH',
	languageProficiencies: [
		{
			language: 'ENGLISH',
			level: 'B1',
			translateTo: 'POLISH',
			generativeContentLanguage: 'ENGLISH'
		}
	]
} as const;

/**
 * OTP login can create worker emails before Flyway/E2eUserProvisioner seed them,
 * leaving `selectedLearningLanguage` null. Words AI and conversations need a
 * initialized account with English proficiency.
 */
export async function ensureE2eWorkerAccount(page: Page, workerIndex: number): Promise<void> {
	const meResponse = await page.request.get(`${testEnv.apiUrl}/api/v1/users/me`);

	if (!meResponse.ok()) {
		throw new Error(`Failed to load /users/me before E2E bootstrap (${meResponse.status()})`);
	}

	const me = (await meResponse.json()) as MeResponse;

	if (me.isAccountInitialized && me.selectedLearningLanguage) {
		return;
	}

	const initResponse = await page.request.post(`${testEnv.apiUrl}/api/v1/users/init-account`, {
		data: {
			...E2E_INIT_ACCOUNT_BODY,
			name: `E2E Worker ${workerIndex % testEnv.workerCount}`
		}
	});

	if (!initResponse.ok()) {
		const body = await initResponse.text();

		throw new Error(
			`Failed to initialize E2E worker account for ${workerEmail(workerIndex)} (${initResponse.status()}): ${body}`
		);
	}

	// Refresh auth store user loaded from OTP verify response.
	await page.reload({ waitUntil: 'domcontentloaded' });
}
