import type { Observable } from 'rxjs';
import type { StreamSimpleItem } from '$conversations/types';
import type { SuggestTopicsRequest } from '$conversations/types';
import { createSSEStream } from '$lib/api-client/utils/sse';

export function httpSuggestConversationTopics<T = StreamSimpleItem>(
	payload: SuggestTopicsRequest
): Observable<T> {
	return createSSEStream<T>('/api/v1/conversations/suggest-topics', {
		method: 'POST',
		body: payload
	});
}
