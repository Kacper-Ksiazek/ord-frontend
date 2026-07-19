# Orchestrate SSE and multi-step API flows in `services/`, not in components

Components never call `http*` functions directly for streaming or multi-step flows. Page-level `services/` files own that orchestration: plain functions for one-off flows (e.g. subscribing to an SSE `Observable` and mapping it to callbacks/Promises), and `use-*.svelte.ts` composables when the flow needs Svelte context or lifecycle (`useMessageFlow`, `useInitializeConversation`).

## Good

```ts
// src/lib/features/conversations/pages/create/services/suggest-conversation-topics.ts
import { httpPostSuggestConversationTopics } from '$conversations/api-client/conversation/sse/http-post-suggest-conversation-topics';

export function suggestConversationTopics({
	onTopic,
	...payload
}: SuggestConversationTopicsParams): Promise<void> {
	return new Promise((resolve, reject) => {
		httpPostSuggestConversationTopics(payload).subscribe({
			next: (topic) => onTopic(topic.value),
			error: () => reject(new Error('Failed to generate topics')),
			complete: () => resolve()
		});
	});
}
```

## Bad

```svelte
<script lang="ts">
	// SSE subscription managed directly inside a component
	import { httpPostSuggestConversationTopics } from '$conversations/api-client/conversation/sse/http-post-suggest-conversation-topics';

	function generate() {
		httpPostSuggestConversationTopics(payload).subscribe({
			next: (topic) => topics.push(topic.value)
		});
	}
</script>
```
