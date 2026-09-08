import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { GenerateWordManualRequest } from '../api/http-post-generate-word-manual';
import { httpPostGenerateWordManual } from '../api/http-post-generate-word-manual';
import { httpPostCreateWordDetails } from '../api/http-post-create-word-details';
import { mapGeneratedManualToCreateRequest } from '../utils/map-generated-manual-to-create-request';
import { invalidateWordCaptureQueries } from '../utils/invalidate-word-capture-queries';

type GenerateWordManualInput = {
	wordId: string;
	request: GenerateWordManualRequest;
};

export function createGenerateWordManualMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: async ({ wordId, request }: GenerateWordManualInput) => {
			const generated = await httpPostGenerateWordManual(request);

			return httpPostCreateWordDetails(wordId, mapGeneratedManualToCreateRequest(generated));
		},
		onSuccess: () => invalidateWordCaptureQueries(queryClient)
	}));
}
