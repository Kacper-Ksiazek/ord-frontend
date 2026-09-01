import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpPatchActivateManyWords } from '../api/http-patch-approve-qaw-many';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createBulkApproveQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => httpPatchActivateManyWords({ ids }),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
