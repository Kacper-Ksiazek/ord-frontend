import type { GetFeedbackOnUserConversationMessageRequest } from '$lib/types/ongoing-conversation/api/requests';
import type { ReviewedUserConversationMessage } from '$lib/types/ongoing-conversation/api/responses';
import { api } from '../../axios';

export async function requestFeedbackForUserMessage(
	body: GetFeedbackOnUserConversationMessageRequest
): Promise<ReviewedUserConversationMessage> {
	const response = await api.post<ReviewedUserConversationMessage>(
		'/api/v1/conversations/ongoing/user/generate-feedback',
		body
	);

	return response.data;
}
