import type { ConversationSummaryDTO } from '$lib/types/conversation/domain/conversation';
import type { GetConversationsFilters } from '$lib/types/conversation/api/list-conversations';
import {
	appendMockConversationSummariesInDev,
	MOCK_EXTRA_CONVERSATION_SUMMARIES,
	mockSummariesMatchingFilters
} from '../dev/mock-conversation-summaries';
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

	let data = response.data;

	if (import.meta.env.DEV && appendMockConversationSummariesInDev) {
		const extras = mockSummariesMatchingFilters(MOCK_EXTRA_CONVERSATION_SUMMARIES, filters);
		const seen = new Set(data.map((c) => c.id));
		const merged = [...data];
		for (const row of extras) {
			if (!seen.has(row.id)) {
				seen.add(row.id);
				merged.push(row);
			}
		}
		merged.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
		data = merged;
	}

	return data;
}
