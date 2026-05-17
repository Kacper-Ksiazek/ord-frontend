import { createMutation } from '@tanstack/svelte-query';
import type { GetAnalysisForUserConversationMessageRequest } from '$lib/types/ongoing-conversation/api/requests';
import { requestAnalysisForUserMessage } from '../api/request-analysis-for-user-message';

export function createRequestAnalysisForUserMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: GetAnalysisForUserConversationMessageRequest) =>
			requestAnalysisForUserMessage(body)
	}));
}
