import { createQuery } from '@tanstack/svelte-query';
import type { ConversationSummaryDTO } from '$conversations/types';
import type { GetConversationsFilters } from '$conversations/types';
import { httpGetConversations } from '../api/http-get-conversations';
import { conversationKeys } from '../keys';

export function createConversationsQuery(getFilters: () => GetConversationsFilters = () => ({})) {
	return createQuery<ConversationSummaryDTO[]>(() => {
		const filters = getFilters();

		return {
			queryKey: conversationKeys.list(filters),
			queryFn: () => httpGetConversations(filters)
		};
	});
}
