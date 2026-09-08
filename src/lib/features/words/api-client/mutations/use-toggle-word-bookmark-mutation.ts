import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { toast } from '$lib/components/utils/toast';
import { getApiErrorMessage } from '$lib/utils/get-api-error-message';
import * as m from '$lib/paraglide/messages.js';
import { httpPostToggleWordProperty } from '../api/http-post-toggle-word-property';
import { applyOptimisticBookmarkToggle } from '../utils/apply-optimistic-bookmark-toggle';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';
import { wordCaptureKeys } from '../keys';

export type ToggleWordBookmarkVariables = {
	wordId: string;
	bookmarkedOnlyFilter?: boolean;
};

export function createToggleWordBookmarkMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ wordId }: ToggleWordBookmarkVariables) =>
			httpPostToggleWordProperty(wordId, 'IS_BOOKMARKED'),
		onMutate: async ({ wordId, bookmarkedOnlyFilter }) => {
			await queryClient.cancelQueries({ queryKey: wordCaptureKeys.all });
			applyOptimisticBookmarkToggle(queryClient, wordId, { bookmarkedOnlyFilter });
		},
		onError: (error) => {
			invalidateWordCaptureQueries(queryClient);
			toast.error(getApiErrorMessage(error, m['features.words.inbox.toast.bookmark_error']()));
		}
	}));
}
