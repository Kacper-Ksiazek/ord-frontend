import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { CreateQAWRequest } from '$quicklyAddedWords/types';
import { httpPostBulkCreateQAW } from '../api/http-post-bulk-create-qaw';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createBulkCreateQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (body: CreateQAWRequest[]) => httpPostBulkCreateQAW(body),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
