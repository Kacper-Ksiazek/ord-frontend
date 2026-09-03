import type { WordType } from '$words/types';

export const WORD_TYPES: WordType[] = ['NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'IDIOM', 'PHRASE'];

export const WORD_TYPE_LABEL: Record<WordType, string> = {
	NOUN: 'Noun',
	VERB: 'Verb',
	ADJECTIVE: 'Adj.',
	ADVERB: 'Adv.',
	IDIOM: 'Idiom',
	PHRASE: 'Phrase'
};

export const WORD_TYPE_OPTIONS: { label: string; value: WordType }[] = WORD_TYPES.map((value) => ({
	label: WORD_TYPE_LABEL[value],
	value
}));

export function getWordTypeLabel(type: WordType): string {
	return WORD_TYPE_LABEL[type];
}
