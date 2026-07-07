import type { CreateConversationRequest } from '$conversations/types';
import type { ConversationDTO } from '$conversations/types';
import { api } from '../../axios';

export async function createConversation(
	body: CreateConversationRequest
): Promise<ConversationDTO> {
	const response = await api.post<ConversationDTO>('/api/v1/conversations/', body);

	return response.data;
}
