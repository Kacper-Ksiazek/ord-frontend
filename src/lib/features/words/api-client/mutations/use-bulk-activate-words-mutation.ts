import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { toast } from '$lib/components/utils/toast';
import { getApiErrorMessage } from '$lib/utils/get-api-error-message';
import * as m from '$lib/paraglide/messages.js';
import { httpPatchActivateManyWords } from '../api/http-patch-activate-many-words';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createBulkActivateWordsMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => httpPatchActivateManyWords({ ids }),
		onSuccess: (_data, ids) => {
			invalidateWordCaptureQueries(queryClient);
			toast.success(m['features.words.inbox.toast.activate_many_success']({ count: ids.length }));
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, m['features.words.inbox.toast.activate_many_error']()));
		}
	}));
}
