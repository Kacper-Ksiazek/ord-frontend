import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpDeleteQAW } from '../api/http-delete-qaw';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createDeleteQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: httpDeleteQAW,
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
