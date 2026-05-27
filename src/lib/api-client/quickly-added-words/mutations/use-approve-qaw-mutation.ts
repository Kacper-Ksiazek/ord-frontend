import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { approveQawMany } from '../api/approve-qaw-many';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createApproveQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (id: string) => approveQawMany({ ids: [id] }),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
