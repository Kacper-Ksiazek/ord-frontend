import type { CompactQAW } from '$lib/types/quickly-added-word';

export const ADD_QAW_POPOVER_MAX_COUNT = 20;
export const ADD_QAW_POPOVER_SCROLL_FROM_COUNT = 6;
/** Approx. height of one QAW block (inputs + description row + divider). */
export const ADD_QAW_POPOVER_ROW_HEIGHT_PX = 96;

class AddQAWPopoverStore {
	values = $state<(CompactQAW & { isDescriptionEnabled: boolean })[]>([]);

	addEmptyRecord() {
		if (this.values.length >= ADD_QAW_POPOVER_MAX_COUNT) return;

		this.values.push({
			isDescriptionEnabled: false,
			word: '',
			translation: '',
			type: null,
			extraMark: undefined,
			definition: ''
		});
	}

	removeRecord(index: number) {
		this.values.splice(index, 1);
	}

	reset() {
		this.values = [];
	}
}

export const addQAWPopoverStore = new AddQAWPopoverStore();
