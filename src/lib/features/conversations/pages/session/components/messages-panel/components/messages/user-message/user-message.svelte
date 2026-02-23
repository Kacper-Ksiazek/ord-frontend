<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import MessageBase from '../message-base.svelte';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import { Feedback } from './components';
	import { highlightFeedbackContent } from './utils/highlight-feedback';
	import FeedbackTextHighlight from './components/feedback-text-highlight/feedback-text-highlight.svelte';
	import isNil from 'lodash/isNil';

	interface UserMessageProps {
		messageIndex: number;
		message: CompactConversationUserMessage;
	}

	const { messageIndex, message }: UserMessageProps = $props();

	let showIconsInHighlightedParts = $state(false);

	const highlightedParts = $derived.by(() => {
		if (isNil(message.feedback)) {
			return null;
		}

		return highlightFeedbackContent(message.content, message.feedback);
	});
</script>

<MessageBase
	messageClass={cn('bg-slate-200 text-gray-700 w-full dark:bg-gray-700 dark:text-gray-200')}
	orientation="right"
>
	{#snippet content()}
		<p>
			{#if highlightedParts && message.feedback}
				{#each highlightedParts as part, index (index)}
					{#if part.highlight}
						{@const id = `highlight-${messageIndex}-${part.highlight}-${index}`}

						<FeedbackTextHighlight
							{id}
							highlightType={part.highlight}
							highlightedText={part.text}
							feedback={message.feedback}
							{showIconsInHighlightedParts}
						/>
					{:else}
						{part.text}
					{/if}
				{/each}
			{:else}
				{message.content}
			{/if}
		</p>
	{/snippet}

	{#snippet footer()}
		<Feedback feedback={message.feedback} bind:showIconsInHighlightedParts />
	{/snippet}
</MessageBase>
