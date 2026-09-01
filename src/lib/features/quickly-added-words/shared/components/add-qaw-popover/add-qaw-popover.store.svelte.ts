import { ADD_QAW_POPOVER_MAX_COUNT } from './add-qaw-popover.constants';
import type { AddQAWFormRow } from './add-qaw-popover.types';

class AddQAWPopoverStore {
	values = $state<AddQAWFormRow[]>([]);

	addEmptyRecord() {
		if (this.values.length >= ADD_QAW_POPOVER_MAX_COUNT) return;

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

function createEmptyRow(): AddQAWFormRow {
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

export const addQAWPopoverStore = new AddQAWPopoverStore();
