import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpPatchActivateManyWords } from '../api/http-patch-approve-qaw-many';
import { invalidateQawQueries } from '../utils/invalidate-qaw-queries';

export function createApproveQawMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (id: string) => httpPatchActivateManyWords({ ids: [id] }),
		onSuccess: () => invalidateQawQueries(queryClient)
	}));
}
