import { createQuery } from '@tanstack/svelte-query';
import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
import { getConversations } from '../api/get-conversations';
import { conversationKeys } from '../keys';

export function createConversationsQuery() {
	return createQuery<ConversationDTO[]>(() => ({
		queryKey: conversationKeys.list(),
		queryFn: getConversations
	}));
}
