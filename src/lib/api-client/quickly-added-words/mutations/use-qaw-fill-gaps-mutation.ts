import { createMutation } from '@tanstack/svelte-query';
import { fillQawGaps } from '../api/fill-qaw-gaps';
import type { QAWFillGapsRequest } from '$lib/types/quickly-added-word/api/fill-gaps';

export function createQawFillGapsMutation() {
	return createMutation(() => ({
		mutationFn: (input: QAWFillGapsRequest) => fillQawGaps(input)
	}));
}
