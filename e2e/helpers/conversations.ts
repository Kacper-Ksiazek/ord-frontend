import type { Page } from '@playwright/test';
import { STORAGE_KEYS } from '../../src/lib/utils/local-storage';
import { testEnv } from '../fixtures/test-env';

type LearningLanguage =
	| 'POLISH'
	| 'ENGLISH'
	| 'GERMAN'
	| 'FRENCH'
	| 'SPANISH'
	| 'ITALIAN'
	| 'NORWEGIAN'
	| 'RUSSIAN'
	| 'SLOVENIAN';

type SeedConversationBody = {
	type: 'SMALL_TALK' | 'TOPIC_EXPLORATION';
	topic: string;
	language: LearningLanguage;
	tone: 'FRIENDLY';
	aiInterlocutorName: string;
	aiInterlocutorAvatarId: string;
};

export type SeedConversationOptions = Partial<
	Pick<
		SeedConversationBody,
		'type' | 'topic' | 'tone' | 'aiInterlocutorName' | 'aiInterlocutorAvatarId'
	>
> & {
	language?: LearningLanguage;
};

type SeedConversationResponse = {
	id: string;
};

async function apiFetch<T>(
	page: Page,
	path: string,
	init: { method?: string; body?: unknown } = {}
): Promise<T> {
	return page.evaluate(
		async ({ apiUrl, requestPath, requestInit }) => {
			const response = await fetch(`${apiUrl}${requestPath}`, {
				method: requestInit.method ?? 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					...(requestInit.body ? { 'Content-Type': 'application/json' } : {})
				},
				body: requestInit.body ? JSON.stringify(requestInit.body) : undefined
			});

			if (!response.ok) {
				throw new Error(`${response.status}: ${await response.text()}`);
			}

			if (response.status === 204) {
				return null;
			}

			return (await response.json()) as T;
		},
		{
			apiUrl: testEnv.apiUrl,
			requestPath: path,
			requestInit: init
		}
	);
}

async function getLearningLanguage(page: Page): Promise<LearningLanguage> {
	return page.evaluate((storageKey) => {
		const raw = localStorage.getItem(storageKey);
		if (!raw) {
			return 'ENGLISH';
		}

		const user = JSON.parse(raw) as { selectedLearningLanguage?: LearningLanguage | null };

		return user.selectedLearningLanguage ?? 'ENGLISH';
	}, STORAGE_KEYS.USER);
}

async function ensureLanguageProficiency(page: Page, language: LearningLanguage): Promise<void> {
	const proficiencies = await apiFetch<Partial<Record<LearningLanguage, string>>>(
		page,
		'/api/v1/language-proficiencies'
	);

	if (proficiencies[language]) {
		return;
	}

	await apiFetch(page, '/api/v1/language-proficiencies', {
		method: 'POST',
		body: {
			language,
			level: 'B1',
			translateTo: language === 'POLISH' ? 'ENGLISH' : 'POLISH',
			generativeContentLanguage: language
		}
	});
}

/**
 * Creates a conversation via the backend API using the authenticated browser session cookies.
 */
export async function seedConversationViaApi(
	page: Page,
	options: SeedConversationOptions = {}
): Promise<SeedConversationResponse> {
	const language = options.language ?? (await getLearningLanguage(page));

	await ensureLanguageProficiency(page, language);

	const body: SeedConversationBody = {
		type: options.type ?? 'SMALL_TALK',
		topic: options.topic ?? `E2E conversation ${Date.now()}`,
		language,
		tone: options.tone ?? 'FRIENDLY',
		aiInterlocutorName: options.aiInterlocutorName ?? 'E2E Interlocutor',
		aiInterlocutorAvatarId: options.aiInterlocutorAvatarId ?? 'AVATAR_EPSILON'
	};

	return apiFetch<SeedConversationResponse>(page, '/api/v1/conversations/', {
		method: 'POST',
		body
	});
}
