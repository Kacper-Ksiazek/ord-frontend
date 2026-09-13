import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { CreateWordRequest } from '$words/types';
import { httpPostCreateWords } from '../api/http-post-create-word';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createCreateWordsMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (body: CreateWordRequest[]) => httpPostCreateWords(body),
		onSuccess: () => invalidateWordCaptureQueries(queryClient)
	}));
}
