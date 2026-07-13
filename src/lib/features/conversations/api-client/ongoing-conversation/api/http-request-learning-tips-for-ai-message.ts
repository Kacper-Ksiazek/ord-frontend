import type { GetLearningTipsForAIMessageRequest } from '$conversations/types';
import type { AIMessageLearningTips } from '$conversations/types';
import { api } from '$lib/api-client/axios';

export async function httpRequestLearningTipsForAIMessage(
	body: GetLearningTipsForAIMessageRequest
): Promise<AIMessageLearningTips> {
	const response = await api.post<AIMessageLearningTips>(
		'/api/v1/conversations/ongoing/ai/generate-learning-tips',
		body
	);

	return response.data;
}
