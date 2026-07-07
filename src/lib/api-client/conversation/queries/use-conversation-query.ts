import { createQuery } from '@tanstack/svelte-query';
import type { ConversationDTO } from '$conversations/types';
import { getConversation } from '../api/get-conversation';
import { conversationKeys } from '../keys';

export function createConversationQuery(id?: string) {
	return createQuery<ConversationDTO>(() => ({
		queryKey: conversationKeys.detail(id ?? ''),
		queryFn: () => getConversation(id ?? ''),
		enabled: !!id
	}));
}
