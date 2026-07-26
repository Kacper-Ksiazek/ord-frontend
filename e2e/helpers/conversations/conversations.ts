import type { Page } from '@playwright/test';
import type { LanguageName } from '$lib/types/core/domain/languages';
import { STORAGE_KEYS } from '../../../src/lib/utils/local-storage';
import { apiFetch } from '../api-client';
import type {
	ConversationDTO,
	CreateConversationRequest,
	LanguageProficienciesIndex,
	SeedConversationOptions
} from './conversations.types';

async function getLearningLanguage(page: Page): Promise<LanguageName> {
	return page.evaluate((storageKey) => {
		const raw = localStorage.getItem(storageKey);
		if (!raw) {
			return 'ENGLISH';
		}

		const user = JSON.parse(raw) as { selectedLearningLanguage?: LanguageName | null };

		return user.selectedLearningLanguage ?? 'ENGLISH';
	}, STORAGE_KEYS.USER);
}

async function ensureLanguageProficiency(page: Page, language: LanguageName): Promise<void> {
	const proficiencies = await apiFetch<LanguageProficienciesIndex>(
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
): Promise<ConversationDTO> {
	const language = options.language ?? (await getLearningLanguage(page));

	await ensureLanguageProficiency(page, language);

	const body: CreateConversationRequest = {
		type: options.type ?? 'SMALL_TALK',
		topic: options.topic ?? `E2E conversation ${Date.now()}`,
		language,
		tone: options.tone ?? 'FRIENDLY',
		aiInterlocutorName: options.aiInterlocutorName ?? 'E2E Interlocutor',
		aiInterlocutorAvatarId: options.aiInterlocutorAvatarId ?? 'AVATAR_EPSILON'
	};

	return apiFetch<ConversationDTO>(page, '/api/v1/conversations/', {
		method: 'POST',
		body
	});
}
