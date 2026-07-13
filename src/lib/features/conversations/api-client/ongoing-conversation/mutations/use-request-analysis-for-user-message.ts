import { createMutation } from '@tanstack/svelte-query';
import type { GetAnalysisForUserConversationMessageRequest } from '$conversations/types';
import { httpPostRequestAnalysisForUserMessage } from '../api/http-post-request-analysis-for-user-message';

export function createRequestAnalysisForUserMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: GetAnalysisForUserConversationMessageRequest) =>
			httpPostRequestAnalysisForUserMessage(body)
	}));
}
