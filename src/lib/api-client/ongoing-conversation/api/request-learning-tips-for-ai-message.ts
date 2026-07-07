import type { GetLearningTipsForAIMessageRequest } from '$conversations/types/ongoing-conversation/api/requests';
import type { AIMessageLearningTips } from '$conversations/types/ongoing-conversation/api/responses';
import { api } from '../../axios';

export async function requestLearningTipsForAIMessage(
	body: GetLearningTipsForAIMessageRequest
): Promise<AIMessageLearningTips> {
	const response = await api.post<AIMessageLearningTips>(
		'/api/v1/conversations/ongoing/ai/generate-learning-tips',
		body
	);

	return response.data;
}
