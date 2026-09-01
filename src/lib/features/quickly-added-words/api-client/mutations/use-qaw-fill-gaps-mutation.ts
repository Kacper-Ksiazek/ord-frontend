import { createMutation } from '@tanstack/svelte-query';
import type { WordFillGapsRequest } from '$quicklyAddedWords/types';
import { httpPostWordFillGaps } from '../api/http-post-fill-qaw-gaps';

export function createQawFillGapsMutation() {
	return createMutation(() => ({
		mutationFn: (input: WordFillGapsRequest) => httpPostWordFillGaps(input)
	}));
}
