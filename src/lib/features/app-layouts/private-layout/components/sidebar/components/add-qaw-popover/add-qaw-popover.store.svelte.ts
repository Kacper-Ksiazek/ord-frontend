import type { CompactQAW } from '$lib/types/quickly-added-word';

class AddQAWPopoverStore {
	values = $state<(CompactQAW & { isDescriptionEnabled: boolean })[]>([]);

	addEmptyRecord() {
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
