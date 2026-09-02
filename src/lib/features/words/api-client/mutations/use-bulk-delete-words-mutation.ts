import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpBulkDeleteWords } from '../api/http-bulk-delete-words';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createBulkDeleteWordsMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => httpBulkDeleteWords(ids),
		onSuccess: () => invalidateWordCaptureQueries(queryClient)
	}));
}
