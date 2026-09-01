import { api } from '$lib/api-client/axios';

export async function httpDeleteConversation(conversationId: string): Promise<void> {
	await api.delete(`/api/v1/conversations/${conversationId}`);
}
