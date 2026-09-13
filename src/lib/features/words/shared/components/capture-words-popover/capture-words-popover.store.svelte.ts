import { CAPTURE_WORDS_POPOVER_MAX_COUNT } from './capture-words-popover.constants';
import type { CaptureFormRow } from './capture-words-popover.types';
import {
	readCaptureWordsDraftFromStorage,
	writeCaptureWordsDraftToStorage
} from './capture-words-popover.storage';

class CaptureWordsPopoverStore {
	values = $state<CaptureFormRow[]>([]);

	hydrateFromStorage(userKey: string | null) {
		if (!userKey) {
			this.values = [createEmptyRow()];

			return;
		}

		const stored = readCaptureWordsDraftFromStorage(userKey);

		if (stored && stored.length > 0) {
			this.values = stored.map((row) => ({
				...row,
				aiError: null,
				isAiGenerated: row.isAiGenerated ?? false
			}));

			return;
		}

		this.values = [createEmptyRow()];
	}

	persistDraft(userKey: string) {
		const snapshot = this.values.map((row) => ({
			isDescriptionEnabled: row.isDescriptionEnabled,
			word: row.word,
			translation: row.translation,
			type: row.type,
			extraMark: row.extraMark,
			definition: row.definition,
			isAiGenerated: row.isAiGenerated
		}));

		writeCaptureWordsDraftToStorage(userKey, snapshot);
	}

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

	removeEmptyRecords() {
		const filledRows = this.values.filter((row) => row.word.trim().length > 0);

		if (filledRows.length > 0) {
			this.values = filledRows;

			return;
		}

		this.values = [createEmptyRow()];
	}
}

export function isCaptureFormRowEmpty(row: CaptureFormRow): boolean {
	return row.word.trim().length === 0;
}

function createEmptyRow(): CaptureFormRow {
	return {
		isDescriptionEnabled: false,
		word: '',
		translation: '',
		type: null,
		extraMark: undefined,
		definition: '',
		aiError: null,
		isAiGenerated: false
	};
}

export const captureWordsPopoverStore = new CaptureWordsPopoverStore();
