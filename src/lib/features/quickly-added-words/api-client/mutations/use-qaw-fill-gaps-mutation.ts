import { createMutation } from '@tanstack/svelte-query';
import type { QAWFillGapsRequest } from '$quicklyAddedWords/types';
import { httpPostFillQAWGaps } from '../api/http-post-fill-qaw-gaps';

export function createQawFillGapsMutation() {
	return createMutation(() => ({
		mutationFn: (input: QAWFillGapsRequest) => httpPostFillQAWGaps(input)
	}));
}
