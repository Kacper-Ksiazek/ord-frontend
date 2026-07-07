import type { ConversationActivityOverview } from '$conversations/types';
import { api } from '../../axios';

export async function getConversationActivityOverview(): Promise<ConversationActivityOverview> {
	const response = await api.get<ConversationActivityOverview>('/api/v1/conversations/overview');

	return response.data;
}
