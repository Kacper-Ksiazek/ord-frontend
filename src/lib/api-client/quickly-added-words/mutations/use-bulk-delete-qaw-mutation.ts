import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { deleteQawMany } from '../api/delete-qaw-many';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createBulkDeleteQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => deleteQawMany(ids),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
