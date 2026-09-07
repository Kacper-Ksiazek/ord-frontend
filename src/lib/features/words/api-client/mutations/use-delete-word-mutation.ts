import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { toast } from '$lib/components/utils/toast';
import { getApiErrorMessage } from '$lib/utils/get-api-error-message';
import * as m from '$lib/paraglide/messages.js';
import { httpDeleteWord } from '../api/http-delete-word';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

export function createDeleteWordMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (id: string) => httpDeleteWord(id),
		onSuccess: () => {
			invalidateWordCaptureQueries(queryClient);
			toast.success(m['features.words.inbox.toast.remove_success']());
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, m['features.words.inbox.toast.remove_error']()));
		}
	}));
}
