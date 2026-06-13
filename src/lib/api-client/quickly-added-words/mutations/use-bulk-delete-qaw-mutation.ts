import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { BulkDeleteQAWRequest } from '$lib/types/quickly-added-word/api/requests';
import { deleteQawMany } from '../api/delete-qaw-many';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createBulkDeleteQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: BulkDeleteQAWRequest) => deleteQawMany(ids),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
