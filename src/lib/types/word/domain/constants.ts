import type { WordType } from './enums';

export const WORD_TYPE_LABEL: Record<WordType, string> = {
	NOUN: 'Noun',
	VERB: 'Verb',
	ADJECTIVE: 'Adj.',
	ADVERB: 'Adv.',
	IDIOM: 'Idiom',
	PHRASE: 'Phrase'
};

export const WordTypeOptions: {
	label: string;
	value: WordType;
}[] = [
	{ label: WORD_TYPE_LABEL.NOUN, value: 'NOUN' },
	{ label: WORD_TYPE_LABEL.VERB, value: 'VERB' },
	{ label: WORD_TYPE_LABEL.ADJECTIVE, value: 'ADJECTIVE' },
	{ label: WORD_TYPE_LABEL.ADVERB, value: 'ADVERB' },
	{ label: WORD_TYPE_LABEL.IDIOM, value: 'IDIOM' },
	{ label: WORD_TYPE_LABEL.PHRASE, value: 'PHRASE' }
];

export function getWordTypeLabel(type: WordType): string {
	return WORD_TYPE_LABEL[type];
}
