import { createMutation } from '@tanstack/svelte-query';
import type { CreateConversationRequest } from '$lib/types/conversation/api/requests';
import { createConversation } from '../api/create-conversation';

export function createCreateConversationMutation() {
	return createMutation(() => ({
		mutationFn: (body: CreateConversationRequest) => createConversation(body)
	}));
}
