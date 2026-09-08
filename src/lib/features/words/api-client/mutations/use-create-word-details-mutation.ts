import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import {
	httpPostCreateWordDetails,
	type CreateWordDetailsRequest
} from '../api/http-post-create-word-details';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

type CreateWordDetailsInput = {
	wordId: string;
	request: CreateWordDetailsRequest;
};

export function createWordDetailsMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ wordId, request }: CreateWordDetailsInput) =>
			httpPostCreateWordDetails(wordId, request),
		onSuccess: () => invalidateWordCaptureQueries(queryClient)
	}));
}
