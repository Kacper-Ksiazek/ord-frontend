import type { Observable } from 'rxjs';
import type { SuggestTopicsRequest } from '$lib/types/conversation/api/requests';

import { createSSEStream } from '../../utils/see';

export function suggestConversationTopics(payload: SuggestTopicsRequest): Observable<unknown> {
	return createSSEStream('/api/v1/conversations/suggest-topics', {
		method: 'POST',
		body: payload
	});
}
