import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpDeleteConversation } from '../api/http-delete-conversation';
import { invalidateConversationQueries } from '../utils/invalidate-conversation-queries';

export function createDeleteConversationMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: httpDeleteConversation,
		onSuccess: () => invalidateConversationQueries(queryClient)
	}));
}
