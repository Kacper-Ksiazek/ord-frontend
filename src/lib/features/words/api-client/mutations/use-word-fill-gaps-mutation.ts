import { createMutation } from '@tanstack/svelte-query';
import type { WordFillGapsRequest } from '$words/types';
import { httpPostWordFillGaps } from '../api/http-post-word-fill-gaps';

export function createWordFillGapsMutation() {
	return createMutation(() => ({
		mutationFn: (input: WordFillGapsRequest) => httpPostWordFillGaps(input)
	}));
}
