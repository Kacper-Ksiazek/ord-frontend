<script lang="ts">
	import { cn, Tooltip } from 'flowbite-svelte';
	import MessageBase from '../message-base.svelte';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import { Feedback } from './components';
	import { highlightFeedbackContent, type HighlightPart } from './utils/highlight-feedback';
	import MistakeCard from '../../../../feedback-panel/components/mistake-card.svelte';
	import StrengthCard from '../../../../feedback-panel/components/strength-card.svelte';
	import SuggestionCard from '../../../../feedback-panel/components/suggestion-card.svelte';
	// import AuthUserAvatar from '$lib/components/auth-user-avatar.svelte';

	interface UserMessageProps {
		messageIndex: number;
		message: CompactConversationUserMessage;
	}

	const { messageIndex, message }: UserMessageProps = $props();

	const highlightedParts = $derived.by(() => {
		if (!message.feedback) {
			return [{ text: message.content }] as HighlightPart[];
		}
		return highlightFeedbackContent(message.content, message.feedback);
	});

	function handleHighlightClick(part: HighlightPart, event: MouseEvent | KeyboardEvent) {
		// Add your interactive logic here
		console.log('Clicked on', part.highlight, part.text);
		// You can access the event, part data, and do anything you need
	}

	function handleHighlightKeydown(part: HighlightPart, event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleHighlightClick(part, event);
		}
	}
</script>

<MessageBase
	messageClass={cn('bg-slate-200 text-gray-700 w-full dark:bg-gray-700 dark:text-gray-200')}
	orientation="right"
>
	<!-- {#snippet avatar()}
		<AuthUserAvatar size={48} />
	{/snippet} -->

	{#snippet content()}
		<p>
			{#each highlightedParts as part, index}
				{#if part.highlight}
					{@const id = `highlight-${messageIndex}-${part.highlight}-${index}`}

					<span
						{id}
						class={cn(
							'px-1 rounded cursor-pointer transition-colors',
							part.highlight === 'mistake'
								? cn(
										'bg-red-200/50 text-red-900 hover:bg-red-300/70',
										'dark:bg-red-900/70 dark:text-red-100 dark:hover:bg-red-600'
									)
								: '',
							part.highlight === 'suggestion'
								? cn(
										'bg-blue-200/50 text-blue-900 hover:bg-blue-300/70',
										'dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-600'
									)
								: '',
							part.highlight === 'strength'
								? cn(
										'bg-green-200/50 text-green-900 hover:bg-green-300/70',
										'dark:bg-green-900/70 dark:text-green-100 dark:hover:bg-green-600'
									)
								: ''
						)}
						onclick={(e) => handleHighlightClick(part, e)}
						onkeydown={(e) => handleHighlightKeydown(part, e)}
						role="button"
						tabindex="0"
					>
						{part.text}
					</span>

					<Tooltip triggeredBy={`#${id}`}>
						<div class="p-2 w-[500px]">
							{#if part.highlight === 'mistake'}
								{@const mistake = message.feedback?.mistakes?.find(
									(m) => m.phrase?.toLowerCase() === part.text.toLowerCase()
								)}

								{#if mistake}
									<MistakeCard {mistake} />
								{/if}
							{:else if part.highlight === 'strength'}
								{@const strength = message.feedback?.strengths?.find(
									(s) => s.phrase?.toLowerCase() === part.text.toLowerCase()
								)}

								{#if strength}
									<StrengthCard {strength} />
								{/if}
							{:else if part.highlight === 'suggestion'}
								{@const suggestion = message.feedback?.suggestions?.find(
									(s) => s.original?.toLowerCase() === part.text.toLowerCase()
								)}

								{#if suggestion}
									<SuggestionCard {suggestion} />
								{/if}
							{/if}
						</div>
					</Tooltip>
				{:else}
					{part.text}
				{/if}
			{/each}
		</p>
	{/snippet}

	{#snippet footer()}
		{#if message.feedback}
			<Feedback feedback={message.feedback} />
		{:else}
			<div class="w-full h-[184px] generation-in-progress px-4 rounded-md"></div>
		{/if}
	{/snippet}
</MessageBase>
