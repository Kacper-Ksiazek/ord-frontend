import type { ConversationSummaryDTO } from '$lib/types/conversation/domain/conversation';
import type { GetConversationsFilters } from '$lib/types/conversation/api/list-conversations';
import { api } from '../../axios';

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
