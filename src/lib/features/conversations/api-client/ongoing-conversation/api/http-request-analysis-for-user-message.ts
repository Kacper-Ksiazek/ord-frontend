import type { GetAnalysisForUserConversationMessageRequest } from '$conversations/types';
import type { ReviewedUserConversationMessage } from '$conversations/types';
import { api } from '$lib/api-client/axios';

export async function httpRequestAnalysisForUserMessage(
	body: GetAnalysisForUserConversationMessageRequest
): Promise<ReviewedUserConversationMessage> {
	const response = await api.post<ReviewedUserConversationMessage>(
		'/api/v1/conversations/ongoing/user/generate-analysis',
		body
	);

	return response.data;
}
