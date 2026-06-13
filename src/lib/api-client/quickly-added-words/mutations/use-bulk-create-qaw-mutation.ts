import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { bulkCreateQaw } from '../api/bulk-create-qaw';
import type { BulkCreateQAWRequest } from '$lib/types/quickly-added-word/api/requests';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createBulkCreateQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (body: BulkCreateQAWRequest) => bulkCreateQaw(body),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
