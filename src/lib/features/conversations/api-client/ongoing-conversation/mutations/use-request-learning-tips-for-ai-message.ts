import { createMutation } from '@tanstack/svelte-query';
import type { GetLearningTipsForAIMessageRequest } from '$conversations/types';
import { httpPostRequestLearningTipsForAIMessage } from '../api/http-post-request-learning-tips-for-ai-message';

export function createRequestLearningTipsForAIMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: GetLearningTipsForAIMessageRequest) =>
			httpPostRequestLearningTipsForAIMessage(body)
	}));
}
