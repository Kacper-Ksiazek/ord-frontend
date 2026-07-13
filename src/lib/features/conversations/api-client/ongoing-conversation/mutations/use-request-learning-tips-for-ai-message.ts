import { createMutation } from '@tanstack/svelte-query';
import type { GetLearningTipsForAIMessageRequest } from '$conversations/types';
import { httpRequestLearningTipsForAIMessage } from '../api/http-request-learning-tips-for-ai-message';

export function createRequestLearningTipsForAIMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: GetLearningTipsForAIMessageRequest) =>
			httpRequestLearningTipsForAIMessage(body)
	}));
}
