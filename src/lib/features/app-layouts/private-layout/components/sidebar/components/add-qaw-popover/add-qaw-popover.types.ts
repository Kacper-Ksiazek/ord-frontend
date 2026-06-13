import type { CompactQAW } from '$lib/types/quickly-added-word';
import type { QAWFillGapsItem } from '$lib/types/quickly-added-word/api/fill-gaps';

export type AddQAWFormRow = CompactQAW & {
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
