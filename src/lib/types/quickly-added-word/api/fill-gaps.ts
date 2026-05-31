import type { LanguageName } from '$lib/types/core/domain/languages';
import type { WordExtraMark, WordType } from '$lib/types/core/domain/words';

/** Per-row fill-gaps request item (OpenAPI pending — align with backend). */
export interface QAWFillGapsItem {
	word: string;
}

export interface QAWFillGapsRequest {
	language: LanguageName;
	items: QAWFillGapsItem[];
}

export type QAWFillGapsRowErrorCode = 'NON_EXISTENT_WORD' | 'AMBIGUOUS_WORD' | (string & {});

export interface QAWFillGapsResultItem {
	inputWord: string;
	word: string | null;
	translation: string | null;
	definition: string | null;
	type: WordType | null;
	extraMark: WordExtraMark | null;
	error: QAWFillGapsRowErrorCode | null;
}

export interface QAWFillGapsResponse {
	items: QAWFillGapsResultItem[];
}
