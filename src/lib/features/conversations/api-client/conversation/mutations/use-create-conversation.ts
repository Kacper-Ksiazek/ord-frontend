import { createMutation } from '@tanstack/svelte-query';
import type { CreateConversationRequest } from '$conversations/types';
import { httpCreateConversation } from '../api/http-create-conversation';

export function createCreateConversationMutation() {
	return createMutation(() => ({
		mutationFn: (body: CreateConversationRequest) => httpCreateConversation(body)
	}));
}
