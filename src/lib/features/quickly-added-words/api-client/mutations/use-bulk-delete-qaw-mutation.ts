import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpBulkDeleteWords } from '../api/http-post-bulk-delete-qaw';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createBulkDeleteQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => httpBulkDeleteWords(ids),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
