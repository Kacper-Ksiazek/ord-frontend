import type { LanguageName, WordExtraMark, WordType } from '../domain/word-type';

/** Per-row fill-gaps request item. OpenAPI pending — align with `/api/v1/quickly-added-words/ai/fill-gaps`. */
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
