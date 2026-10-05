import * as m from '$lib/paraglide/messages';
import type { WordType } from '$words/types';

const WORD_TYPE_LABEL_FALLBACK: Record<WordType, string> = {
	NOUN: 'Noun',
	VERB: 'Verb',
	ADJECTIVE: 'Adj.',
	ADVERB: 'Adv.',
	IDIOM: 'Idiom',
	PHRASE: 'Phrase'
};

export function getWordTypeLabel(type: WordType | undefined): string {
	if (!type) {
		return '';
	}

	const messageKey = `features.words.enums.word_types.${type}.label` as keyof typeof m;
	const messageFn = m[messageKey] as (() => string) | undefined;

	return messageFn?.() ?? WORD_TYPE_LABEL_FALLBACK[type];
}
