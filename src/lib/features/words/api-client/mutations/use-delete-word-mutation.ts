import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpDeleteWord } from '../api/http-delete-word';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createDeleteWordMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (id: string) => httpDeleteWord(id),
		onSuccess: () => invalidateWordCaptureQueries(queryClient)
	}));
}
