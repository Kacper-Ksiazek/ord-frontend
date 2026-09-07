import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { toast } from '$lib/components/utils/toast';
import { getApiErrorMessage } from '$lib/utils/get-api-error-message';
import * as m from '$lib/paraglide/messages.js';
import { httpBulkDeleteWords } from '../api/http-bulk-delete-words';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createBulkDeleteWordsMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => httpBulkDeleteWords(ids),
		onSuccess: (_data, ids) => {
			invalidateWordCaptureQueries(queryClient);
			toast.success(m['features.words.inbox.toast.remove_many_success']({ count: ids.length }));
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, m['features.words.inbox.toast.remove_many_error']()));
		}
	}));
}
