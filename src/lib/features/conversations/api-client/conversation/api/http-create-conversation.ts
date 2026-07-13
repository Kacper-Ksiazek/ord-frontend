import type { CreateConversationRequest } from '$conversations/types';
import type { ConversationDTO } from '$conversations/types';
import { api } from '$lib/api-client/axios';

export async function httpCreateConversation(
	body: CreateConversationRequest
): Promise<ConversationDTO> {
	const response = await api.post<ConversationDTO>('/api/v1/conversations/', body);

	return response.data;
}
