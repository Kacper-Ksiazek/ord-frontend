import type { QueryClient } from '@tanstack/svelte-query';
import { conversationKeys } from '../keys';

export function invalidateConversationQueries(queryClient: QueryClient) {
	return Promise.all([
		queryClient.invalidateQueries({ queryKey: conversationKeys.lists() }),
		queryClient.invalidateQueries({ queryKey: conversationKeys.overview() })
	]);
}
