<script lang="ts">
	import { highlightFeedbackContent } from '../utils/highlight-feedback';
	import FeedbackTextHighlight from '../components/feedback-text-highlight/feedback-text-highlight.svelte';
	import isNil from 'lodash/isNil';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';

	interface UserMessageProps {
		messageIndex: number;
		messageContent: string;
		feedback: ConversationUserMessageFeedbackDTO | null;
		disableHoverHighlight?: boolean;
		showIconsInHighlightedParts?: boolean;
	}

	let {
		messageIndex,
		messageContent,
		feedback,
		disableHoverHighlight = false,
		showIconsInHighlightedParts = false
	}: UserMessageProps = $props();

	const highlightedParts = $derived.by(() => {
		if (isNil(feedback)) {
			return null;
		}

		return highlightFeedbackContent(messageContent, feedback);
	});
</script>

<p>
	{#if highlightedParts && feedback}
		{#each highlightedParts as part, index (index)}
			{#if part.highlight}
				{@const id = `highlight-${messageIndex}-${part.highlight}-${index}`}

				<FeedbackTextHighlight
					{id}
					highlightType={part.highlight}
					highlightedText={part.text}
					{disableHoverHighlight}
					{feedback}
					{showIconsInHighlightedParts}
				/>
			{:else}
				{part.text}
			{/if}
		{/each}
	{:else}
		{messageContent}
	{/if}
</p>
