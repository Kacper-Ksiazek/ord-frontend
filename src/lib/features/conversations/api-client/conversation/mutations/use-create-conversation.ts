import { createMutation } from '@tanstack/svelte-query';
import type { CreateConversationRequest } from '$conversations/types';
import { httpPostCreateConversation } from '../api/http-post-create-conversation';

export function createCreateConversationMutation() {
	return createMutation(() => ({
		mutationFn: (body: CreateConversationRequest) => httpPostCreateConversation(body)
	}));
}
