import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
import { api } from '../../axios';

export async function getConversations(): Promise<ConversationDTO[]> {
	const response = await api.get<ConversationDTO[]>('/api/v1/conversations/');

	return response.data;
}
