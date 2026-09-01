import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpDeleteWord } from '../api/http-delete-qaw';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createDeleteQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (id: string) => httpDeleteWord(id),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
