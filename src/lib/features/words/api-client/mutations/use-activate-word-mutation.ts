import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpPatchActivateManyWords } from '../api/http-patch-activate-many-words';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createActivateWordMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (id: string) => httpPatchActivateManyWords({ ids: [id] }),
		onSuccess: () => invalidateWordCaptureQueries(queryClient)
	}));
}
