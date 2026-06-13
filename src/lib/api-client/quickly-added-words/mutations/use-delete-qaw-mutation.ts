import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { deleteQaw } from '../api/delete-qaw';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createDeleteQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: deleteQaw,
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
