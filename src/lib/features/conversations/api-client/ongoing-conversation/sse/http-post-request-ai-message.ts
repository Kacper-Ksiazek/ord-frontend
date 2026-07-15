import type { Observable } from 'rxjs';
import type { CreateOngoingConversationMessageRequest } from '$conversations/types';
import { createSSEStream } from '$lib/api-client/utils/sse';

export function httpPostRequestAIMessage(
	body: CreateOngoingConversationMessageRequest
): Observable<string> {
	return createSSEStream<string>('/api/v1/conversations/ongoing/ai/request-message', {
		method: 'POST',
		body
	});
}
