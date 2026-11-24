import type { LanguageName } from '$lib/types/core/domain/languages';

export const PHRASE_EXAMPLES_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** IndexedDB cache key for AI example sentences of one phrase in one language (case-insensitive). */
export function phraseExamplesCacheKey(language: LanguageName, phrase: string): string {
	return `ai-explainer:phrase-examples:${language}:${phrase.trim().toLocaleLowerCase()}`;
}
