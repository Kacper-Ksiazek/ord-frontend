import { createQuery } from '@tanstack/svelte-query';
import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
import { getConversation } from '../api/get-conversation';
import { conversationKeys } from '../keys';

export function createConversationQuery(id: string) {
	return createQuery<ConversationDTO>(() => ({
		queryKey: conversationKeys.detail(id),
		queryFn: () => getConversation(id),
		enabled: !!id
	}));
}
