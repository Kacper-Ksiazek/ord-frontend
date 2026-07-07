import { createMutation } from '@tanstack/svelte-query';
import type { GetLearningTipsForAIMessageRequest } from '$conversations/types/ongoing-conversation/api/requests';
import { requestLearningTipsForAIMessage } from '../api/request-learning-tips-for-ai-message';

export function createRequestLearningTipsForAIMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: GetLearningTipsForAIMessageRequest) => requestLearningTipsForAIMessage(body)
	}));
}
