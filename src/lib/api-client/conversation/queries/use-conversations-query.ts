import { createQuery } from '@tanstack/svelte-query';
import type { ConversationSummaryDTO } from '$conversations/types/domain/conversation';
import type { GetConversationsFilters } from '$conversations/types/api/list-conversations';
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
