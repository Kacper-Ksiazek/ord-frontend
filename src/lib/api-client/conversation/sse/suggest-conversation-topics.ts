import type { Observable } from 'rxjs';
import type { StreamSimpleItem } from '$conversations/types/api';
import type { SuggestTopicsRequest } from '$conversations/types/api/requests';
import { createSSEStream } from '../../utils/sse';

export function suggestConversationTopics<T = StreamSimpleItem>(
	payload: SuggestTopicsRequest
): Observable<T> {
	return createSSEStream<T>('/api/v1/conversations/suggest-topics', {
		method: 'POST',
		body: payload
	});
}
