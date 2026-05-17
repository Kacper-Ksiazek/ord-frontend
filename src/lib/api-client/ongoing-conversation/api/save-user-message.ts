import type { SaveUserConversationMessageRequest } from '$lib/types/ongoing-conversation/api/requests';
import type { ConversationMessageDTO } from '$lib/types/ongoing-conversation/api/responses';
import { api } from '../../axios';

export async function saveUserMessage(
	body: SaveUserConversationMessageRequest
): Promise<ConversationMessageDTO> {
	const response = await api.post<ConversationMessageDTO>(
		'/api/v1/conversations/ongoing/user/save-message',
		body
	);

	return response.data;
}
