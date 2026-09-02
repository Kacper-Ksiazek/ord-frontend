import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { CaptureWordRequest } from '$words/types';
import { httpPostCaptureWords } from '../api/http-post-capture-words';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createCaptureWordsMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (body: CaptureWordRequest[]) => httpPostCaptureWords(body),
		onSuccess: () => invalidateWordCaptureQueries(queryClient)
	}));
}
