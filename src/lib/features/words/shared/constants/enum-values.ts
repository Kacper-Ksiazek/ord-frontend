import type { WordExtraMark, WordType } from '$words/types';
import { getWordTypeLabel as getWordTypeLabelI18n } from '$words/shared/utils/get-word-type-label';

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

export function getWordTypeSelectOptions(): { label: string; value: WordType }[] {
	return WORD_TYPES.map((value) => ({
		label: getWordTypeLabelI18n(value),
		value
	}));
}

export const WORD_EXTRA_MARK_OPTIONS: { label: string; value: WordExtraMark }[] =
	WORD_EXTRA_MARKS.map((value) => ({
		label: WORD_EXTRA_MARK_LABEL[value],
		value
	}));

export function getWordTypeLabel(type: WordType): string {
	return getWordTypeLabelI18n(type);
}

export function getWordExtraMarkLabel(mark: WordExtraMark): string {
	return WORD_EXTRA_MARK_LABEL[mark];
}
