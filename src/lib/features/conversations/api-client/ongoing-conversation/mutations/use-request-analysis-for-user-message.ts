import { createMutation } from '@tanstack/svelte-query';
import type { GetAnalysisForUserConversationMessageRequest } from '$conversations/types';
import { httpRequestAnalysisForUserMessage } from '../api/http-request-analysis-for-user-message';

export function createRequestAnalysisForUserMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: GetAnalysisForUserConversationMessageRequest) =>
			httpRequestAnalysisForUserMessage(body)
	}));
}
