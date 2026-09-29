# Orchestrate SSE and multi-step API flows in `services/`, not in components

Components never call `http*` functions directly for streaming or multi-step flows. Page-level `services/` files own that orchestration: plain functions for one-off flows (e.g. subscribing to an SSE `Observable` and mapping it to callbacks/Promises), and `use-*.svelte.ts` composables when the flow needs Svelte context or lifecycle (`useMessageFlow`, `useInitializeConversation`).

The same rule applies to **dialogs and popovers**: subscribing to SSE, mapping stream chunks, and follow-up actions belong in `services/` or a colocated `use-*.svelte.ts` — not inlined in the modal `.svelte` alongside hundreds of lines of markup.

Reuse shared subscription helpers from `$lib/services/` when the lifecycle pattern is the same across features; keep feature-specific chunk routing and `http*` calls in the feature `use-*-flow` composable.

## Good

```ts
// src/lib/services/use-text-stream-subscription.svelte.ts — shared subscribe/stop/onDestroy
// src/lib/features/ai-explainer/shared/services/use-explain-phrase-flow.svelte.ts — product orchestration
import { useTextStreamSubscription } from '$lib/services/use-text-stream-subscription.svelte';
import { httpPostExplainPhrase } from '$aiExplainer/api-client/sse/http-post-explain-phrase';

export function useExplainPhraseFlow() {
	const textStream = useTextStreamSubscription();

	function explain() {
		textStream.start(httpPostExplainPhrase(payload), {
			onChunk: (chunk) => {
				streamedText += chunk;
			}
		});
	}

	return { explain /* … */ };
}
```

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

```svelte
<script lang="ts">
	// Each popover reimplements subscribe/unsubscribe instead of $lib/services/use-text-stream-subscription.svelte.ts
	let subscription: Subscription | undefined;

	function startStream(source: Observable<string>) {
		subscription?.unsubscribe();
		subscription = source.subscribe({ next: (chunk) => (text += chunk) });
	}

	onDestroy(() => subscription?.unsubscribe());
</script>
```
