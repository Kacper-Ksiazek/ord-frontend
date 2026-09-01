import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { CaptureWordRequest } from '$quicklyAddedWords/types';
import { httpPostCaptureWords } from '../api/http-post-bulk-create-qaw';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createBulkCreateQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (body: CaptureWordRequest[]) => httpPostCaptureWords(body),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
