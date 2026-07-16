# SSE callers use `createSSEStream` and return an RxJS `Observable`

Streaming endpoints live in a feature's `sse/` folder, follow the same `http-{method}-{action}.ts` naming as REST callers (currently all `http-post-*`), and return `Observable<T>` built with `createSSEStream` from `$lib/api-client/utils/sse`. Never hand-roll `EventSource` or `fetch` streaming in features.

## Good

```ts
// src/lib/features/conversations/api-client/conversation/sse/http-post-suggest-conversation-topics.ts
import type { Observable } from 'rxjs';
import type { StreamSimpleItem, SuggestTopicsRequest } from '$conversations/types';
import { createSSEStream } from '$lib/api-client/utils/sse';

export function httpPostSuggestConversationTopics<T = StreamSimpleItem>(
	payload: SuggestTopicsRequest
): Observable<T> {
	return createSSEStream<T>('/api/v1/conversations/suggest-topics', {
		method: 'POST',
		body: payload
	});
}
```

## Bad

```ts
// Hand-rolled EventSource in the api/ folder with callback-style API
export function suggestTopics(payload: unknown, onMessage: (data: string) => void) {
	const source = new EventSource('/api/v1/conversations/suggest-topics');
	source.onmessage = (event) => onMessage(event.data);
}
```
