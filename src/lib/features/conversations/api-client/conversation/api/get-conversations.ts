import type { ConversationSummaryDTO } from '$conversations/types';
import type { GetConversationsFilters } from '$conversations/types';
import { api } from '$lib/api-client/axios';

export async function getConversations(
	filters: GetConversationsFilters = {}
): Promise<ConversationSummaryDTO[]> {
	const params: GetConversationsFilters = {};
	if (filters.search !== undefined && filters.search !== '') {
		params.search = filters.search;
	}
	if (filters.recencyBucket !== undefined) {
		params.recencyBucket = filters.recencyBucket;
	}
	if (filters.type !== undefined) {
		params.type = filters.type;
	}

	const response = await api.get<ConversationSummaryDTO[]>('/api/v1/conversations/', {
		params: Object.keys(params).length > 0 ? params : undefined
	});

	return response.data;
}
