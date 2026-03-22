import { createQuery } from '@tanstack/svelte-query';
import type { ConversationSummaryDTO } from '$lib/types/conversation/domain/conversation';
import type { GetConversationsFilters } from '$lib/types/conversation/api/list-conversations';
import { getConversations } from '../api/get-conversations';
import { conversationKeys } from '../keys';

export function createConversationsQuery(getFilters: () => GetConversationsFilters = () => ({})) {
	return createQuery<ConversationSummaryDTO[]>(() => {
		const filters = getFilters();

		return {
			queryKey: conversationKeys.list(filters),
			queryFn: () => getConversations(filters)
		};
	});
}
