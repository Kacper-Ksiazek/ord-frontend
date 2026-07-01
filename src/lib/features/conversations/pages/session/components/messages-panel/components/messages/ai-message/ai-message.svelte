<script lang="ts">
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$lib/types/conversation/domain/conversation';
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import { cn } from 'flowbite-svelte';
	import MessageBase from '../message-base.svelte';
	import { TextDotsAnimation as TextWithThreeDotsAnimation } from '$lib/components/feedback/text-dots-animation';
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';
	import { LearningTips } from './components/learning-tips';
	import { highlightLearningTipsContent } from './utils/highlight-learning-tips';
	import { LearningTipTextHighlight } from './components/learning-tip-text-highlight';
	import isNil from 'lodash/isNil';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	interface AiMessageProps {
		message: string;
		messageIndex: number;
		isStillGenerating: boolean;
		learningTips: AIMessageLearningTips | null;
	}

	const { message, messageIndex, isStillGenerating, learningTips }: AiMessageProps = $props();

	const { interlocutor } = getConversationContext();

	const highlightedParts = $derived.by(() => {
		if (isNil(learningTips) || !message) {
			return null;
		}

		return highlightLearningTipsContent(message, learningTips);
	});

	let showIconsInHighlightedParts = $state(false);
</script>

<MessageBase
	testId={E2E_TEST_IDS.session.aiMessage(messageIndex)}
	messageClass={cn(
		isStillGenerating && 'generation-in-progress' //
	)}
>
	{#snippet avatar()}
		<AiInterlocutorAvatar
			avatarId={interlocutor.avatarId as ConversationAIInterlocutorAvatarId}
			size="fullsize"
			class="rounded-full shadow-md w-12 h-12"
		/>
	{/snippet}

	{#snippet content()}
		{#if message}
			<p>
				{#if highlightedParts && learningTips}
					{#each highlightedParts as part, index (index)}
						{#if part.highlight}
							{@const id = `learning-tip-${part.highlight}-${messageIndex}-${index}`}

							<LearningTipTextHighlight
								{id}
								highlightType={part.highlight}
								highlightedText={part.text}
								{learningTips}
								{showIconsInHighlightedParts}
							/>
						{:else}
							{part.text}
						{/if}
					{/each}
				{:else}
					{message}
				{/if}
			</p>
		{:else}
			<TextWithThreeDotsAnimation text="Myśli" />
		{/if}
	{/snippet}

	{#snippet footer()}
		{#if !isStillGenerating}
			<LearningTips {message} {learningTips} {messageIndex} bind:showIconsInHighlightedParts />
		{/if}
	{/snippet}
</MessageBase>
