import type { SaveUserConversationMessageRequest } from '$conversations/types';
import type { ConversationMessageDTO } from '$conversations/types';
import { api } from '$lib/api-client/axios';

export async function httpPostSaveUserMessage(
	body: SaveUserConversationMessageRequest
): Promise<ConversationMessageDTO> {
	const response = await api.post<ConversationMessageDTO>(
		'/api/v1/conversations/ongoing/user/save-message',
		body
	);

	return response.data;
}
