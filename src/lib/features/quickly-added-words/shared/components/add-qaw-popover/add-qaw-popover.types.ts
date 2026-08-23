import type { QAWFillGapsItem, WordExtraMark, WordType } from '$quicklyAddedWords/types';

export type AddQAWFormRow = {
	word: string;
	translation: string;
	definition: string;
	type: WordType | null;
	extraMark: WordExtraMark | null | undefined;
	isDescriptionEnabled: boolean;
	aiError: string | null;
};

export type CollectFillGapsItemsResult =
	| {
			ok: true;
			items: QAWFillGapsItem[];
			rowIndices: number[];
	  }
	| { ok: false; reason: 'no_words' | 'too_many_words' | 'word_too_long' };
