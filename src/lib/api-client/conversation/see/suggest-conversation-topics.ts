import type { Observable } from 'rxjs';
import type { StreamSimpleItem } from '$lib/types/conversation/api';
import type { SuggestTopicsRequest } from '$lib/types/conversation/api/requests';
import { createSSEStream } from '../../utils/see';

export function suggestConversationTopics<T = StreamSimpleItem>(
	payload: SuggestTopicsRequest
): Observable<T> {
	return createSSEStream<T>('/api/v1/conversations/suggest-topics', {
		method: 'POST',
		body: payload
	});
}
