import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpPatchActivateManyWords } from '../api/http-patch-activate-many-words';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createBulkActivateWordsMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => httpPatchActivateManyWords({ ids }),
		onSuccess: () => invalidateWordCaptureQueries(queryClient)
	}));
}
