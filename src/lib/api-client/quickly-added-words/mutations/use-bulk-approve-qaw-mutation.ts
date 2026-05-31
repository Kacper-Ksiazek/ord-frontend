import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { approveQawMany } from '../api/approve-qaw-many';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createBulkApproveQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => approveQawMany({ ids }),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
