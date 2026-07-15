import type { ConversationDTO } from '$conversations/types';
import { api } from '$lib/api-client/axios';

export async function httpGetConversation(id: string): Promise<ConversationDTO> {
	const response = await api.get<ConversationDTO>(`/api/v1/conversations/${id}`);

	return response.data;
}
