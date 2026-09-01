import type { WordFillGapsItem, WordExtraMark, WordType } from '$quicklyAddedWords/types';

export type AddQAWFormRow = {
	isDescriptionEnabled: boolean;
	word: string;
	translation: string;
	type: WordType | null;
	extraMark?: WordExtraMark;
	definition: string;
	aiError: string | null;
};

export type AddQawSaveStatus = 'idle' | 'loading' | 'success' | 'error';

export type CollectFillGapsItemsResult =
	| { ok: false; reason: 'no_words' | 'word_too_long' | 'too_many_words' }
	| {
			ok: true;
			items: WordFillGapsItem[];
			rowIndices: number[];
	  };
