import type { Observable } from 'rxjs';
import type { StreamSimpleItem } from '$lib/types/conversation/api';
import type { CreateOngoingConversationMessageRequest } from '$lib/types/ongoing-conversation/api/requests';
import { createSSEStream } from '../../utils/sse';

export function requestAIMessage<T = StreamSimpleItem>(
	body: CreateOngoingConversationMessageRequest
): Observable<T> {
	return createSSEStream<T>('/api/v1/conversations/ongoing/ai/request-message', {
		method: 'POST',
		body
	});
}
