import type { Observable } from 'rxjs';
import type { CreateOngoingConversationMessageRequest } from '$conversations/types/ongoing-conversation/api/requests';
import { createSSEStream } from '../../utils/sse';

export function requestAIMessage(
	body: CreateOngoingConversationMessageRequest
): Observable<string> {
	return createSSEStream<string>('/api/v1/conversations/ongoing/ai/request-message', {
		method: 'POST',
		body
	});
}
