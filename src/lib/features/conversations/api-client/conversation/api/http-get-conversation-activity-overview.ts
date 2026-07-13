import type { ConversationActivityOverview } from '$conversations/types';
import { api } from '$lib/api-client/axios';

export async function httpGetConversationActivityOverview(): Promise<ConversationActivityOverview> {
	const response = await api.get<ConversationActivityOverview>('/api/v1/conversations/overview');

	return response.data;
}
