import { CAPTURE_WORDS_POPOVER_MAX_COUNT } from './capture-words-popover.constants';
import type { CaptureFormRow } from './capture-words-popover.types';

class CaptureWordsPopoverStore {
	values = $state<CaptureFormRow[]>([]);

	addEmptyRecord() {
		if (this.values.length >= CAPTURE_WORDS_POPOVER_MAX_COUNT) return;

		this.values.push(createEmptyRow());
	}

	removeRecord(index: number) {
		this.values.splice(index, 1);
	}

	reset() {
		this.values = [createEmptyRow()];
	}

	clearAiErrors() {
		for (const row of this.values) {
			row.aiError = null;
		}
	}
}

function createEmptyRow(): CaptureFormRow {
	return {
		isDescriptionEnabled: false,
		word: '',
		translation: '',
		type: null,
		extraMark: undefined,
		definition: '',
		aiError: null
	};
}

export const captureWordsPopoverStore = new CaptureWordsPopoverStore();
