import type { ConversationDTO } from '$conversations/types';
import { api } from '../../axios';

export async function getConversation(id: string): Promise<ConversationDTO> {
	const response = await api.get<ConversationDTO>(`/api/v1/conversations/${id}`);

	return response.data;
}
