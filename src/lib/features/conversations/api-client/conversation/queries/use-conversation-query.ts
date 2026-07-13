import { createQuery } from '@tanstack/svelte-query';
import type { ConversationDTO } from '$conversations/types';
import { httpGetConversation } from '../api/http-get-conversation';
import { conversationKeys } from '../keys';

export function createConversationQuery(id?: string) {
	return createQuery<ConversationDTO>(() => ({
		queryKey: conversationKeys.detail(id ?? ''),
		queryFn: () => httpGetConversation(id ?? ''),
		enabled: !!id
	}));
}
