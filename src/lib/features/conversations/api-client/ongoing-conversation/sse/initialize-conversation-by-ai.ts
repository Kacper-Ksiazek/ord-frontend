import type { Observable } from 'rxjs';
import { createSSEStream } from '$lib/api-client/utils/sse';

export function initializeConversationByAI(conversationId: string | undefined): Observable<string> {
	return createSSEStream<string>('/api/v1/conversations/ongoing/ai/initialize', {
		method: 'POST',
		params: {
			conversationId: conversationId ?? ''
		}
	});
}
