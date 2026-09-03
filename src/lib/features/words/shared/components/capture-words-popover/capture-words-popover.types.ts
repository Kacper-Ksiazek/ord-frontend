import type { WordFillGapsItem, WordExtraMark, WordType } from '$words/types';

export type CaptureFormRow = {
	isDescriptionEnabled: boolean;
	word: string;
	translation: string;
	type: WordType | null;
	extraMark?: WordExtraMark;
	definition: string;
	aiError: string | null;
};

export type CaptureWordsSaveStatus = 'idle' | 'loading' | 'success' | 'error';

export type CollectFillGapsItemsResult =
	| { ok: false; reason: 'no_words' | 'word_too_long' | 'too_many_words' }
	| {
			ok: true;
			items: WordFillGapsItem[];
			rowIndices: number[];
	  };
