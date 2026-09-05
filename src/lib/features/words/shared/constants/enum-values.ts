import type { WordExtraMark, WordType } from '$words/types';

export const WORD_TYPES: WordType[] = ['NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'IDIOM', 'PHRASE'];

export const WORD_TYPE_LABEL: Record<WordType, string> = {
	NOUN: 'Noun',
	VERB: 'Verb',
	ADJECTIVE: 'Adj.',
	ADVERB: 'Adv.',
	IDIOM: 'Idiom',
	PHRASE: 'Phrase'
};

export const WORD_EXTRA_MARKS: WordExtraMark[] = [
	'OFFENSIVE',
	'SLANG',
	'FORMAL',
	'INFORMAL',
	'SCIENTIFIC',
	'TECHNICAL',
	'LEGAL',
	'MEDICAL',
	'COLLOQUIAL',
	'POETIC'
];

export const WORD_EXTRA_MARK_LABEL: Record<WordExtraMark, string> = {
	OFFENSIVE: 'Offensive',
	SLANG: 'Slang',
	FORMAL: 'Formal',
	INFORMAL: 'Informal',
	SCIENTIFIC: 'Scientific',
	TECHNICAL: 'Technical',
	LEGAL: 'Legal',
	MEDICAL: 'Medical',
	COLLOQUIAL: 'Colloquial',
	POETIC: 'Poetic'
};

export const WORD_TYPE_OPTIONS: { label: string; value: WordType }[] = WORD_TYPES.map((value) => ({
	label: WORD_TYPE_LABEL[value],
	value
}));

export function getWordTypeLabel(type: WordType): string {
	return WORD_TYPE_LABEL[type];
}

export function getWordExtraMarkLabel(mark: WordExtraMark): string {
	return WORD_EXTRA_MARK_LABEL[mark];
}
