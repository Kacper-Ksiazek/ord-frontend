import type { GetConversationsFilters } from '$lib/types/conversation/api/list-conversations';

const listFilterKey = (filters: GetConversationsFilters) =>
	({
		search: filters.search ?? null,
		recencyBucket: filters.recencyBucket ?? null,
		type: filters.type ?? null
	}) as const;

export const conversationKeys = {
	all: ['conversations'] as const,

	lists: () => [...conversationKeys.all, 'list'] as const,

	list: (filters: GetConversationsFilters = {}) =>
		[...conversationKeys.lists(), listFilterKey(filters)] as const,

	details: () => [...conversationKeys.all, 'detail'] as const,

	detail: (id: string) => [...conversationKeys.details(), id] as const
};
