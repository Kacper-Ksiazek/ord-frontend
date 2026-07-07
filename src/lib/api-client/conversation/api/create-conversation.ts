import type { CreateConversationRequest } from '$conversations/types/api/requests';
import type { ConversationDTO } from '$conversations/types/domain/conversation';
import { api } from '../../axios';

export async function createConversation(
	body: CreateConversationRequest
): Promise<ConversationDTO> {
	const response = await api.post<ConversationDTO>('/api/v1/conversations/', body);

	return response.data;
}
