import type { CreateConversationRequest } from '$lib/types/conversation/api/requests';
import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
import { api } from '../../axios';

export async function createConversation(
	body: CreateConversationRequest
): Promise<ConversationDTO> {
	const response = await api.post<ConversationDTO>('/api/v1/conversations/', body);

	return response.data;
}
