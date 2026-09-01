<script lang="ts">
	import AiInterlocutorAvatar from '$conversations/shared/components/ai-interlocutor-avatar.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$conversations/types';
	import type { AIMessageLearningTips } from '$conversations/types';
	import { cn } from '$lib/utils/cn';
	import MessageBase from '../message-base.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';
	import { LearningTips } from './components/learning-tips';
	import { highlightLearningTipsContent } from './utils/highlight-learning-tips';
	import { LearningTipTextHighlight } from './components/learning-tip-text-highlight';
	import isNil from 'lodash/isNil';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

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
</script>

<MessageBase
	dataTestId={E2E_TEST_IDS.session.aiMessage(messageIndex)}
	messageClass={cn(
		'bg-message-ai',
		isStillGenerating && 'generation-in-progress' //
	)}
>
	{#snippet avatar()}
		<AiInterlocutorAvatar
			avatarId={interlocutor.avatarId as ConversationAIInterlocutorAvatarId}
			size="fullsize"
			class="h-12 w-12 rounded-full"
		/>
	{/snippet}

	{#snippet content()}
		{#if message}
			{#if highlightedParts && learningTips}
				{#each highlightedParts as part, index (index)}
					{#if part.highlight}
						{@const id = `learning-tip-${part.highlight}-${messageIndex}-${index}`}

						<LearningTipTextHighlight
							{id}
							highlightType={part.highlight}
							highlightedText={part.text}
							{learningTips}
						/>
					{:else}
						{part.text}
					{/if}
				{/each}
			{:else}
				{message}
			{/if}
		{:else}
			<TextWithThreeDotsAnimation text="Myśli" />
		{/if}
	{/snippet}

	{#snippet footer()}
		{#if !isStillGenerating}
			<LearningTips {message} {learningTips} {messageIndex} />
		{/if}
	{/snippet}
</MessageBase>
