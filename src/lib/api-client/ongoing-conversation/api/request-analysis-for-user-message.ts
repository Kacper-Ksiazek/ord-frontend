import type { GetAnalysisForUserConversationMessageRequest } from '$conversations/types/ongoing-conversation/api/requests';
import type { ReviewedUserConversationMessage } from '$conversations/types/ongoing-conversation/api/responses';
import { api } from '../../axios';

export async function requestAnalysisForUserMessage(
	body: GetAnalysisForUserConversationMessageRequest
): Promise<ReviewedUserConversationMessage> {
	const response = await api.post<ReviewedUserConversationMessage>(
		'/api/v1/conversations/ongoing/user/generate-analysis',
		body
	);

	return response.data;
}
