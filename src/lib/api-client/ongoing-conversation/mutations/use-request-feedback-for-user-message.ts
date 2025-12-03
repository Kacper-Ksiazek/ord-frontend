import { createMutation } from '@tanstack/svelte-query';
import type { GetFeedbackOnUserConversationMessageRequest } from '$lib/types/ongoing-conversation/api/requests';
import { requestFeedbackForUserMessage } from '../api/request-feedback-for-user-message';

export function createRequestFeedbackForUserMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: GetFeedbackOnUserConversationMessageRequest) =>
			requestFeedbackForUserMessage(body)
	}));
}
