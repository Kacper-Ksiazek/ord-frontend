import type { SaveUserConversationMessageRequest } from '$conversations/types';
import type { ConversationMessageDTO } from '$conversations/types';
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
