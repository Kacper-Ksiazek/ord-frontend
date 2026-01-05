<script lang="ts">
	import './user-message-feedback-cards.css';
	import { Badge, cn } from 'flowbite-svelte';
	import {
		CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP,
		type ConversationMessageMistake
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import {
		getCardBackgroundColor,
		getCardBorderColor
	} from '../../../utils/get-user-message-feedback-colors';

	interface Props {
		mistake: ConversationMessageMistake;
	}

	let { mistake }: Props = $props();

	const cardBg = getCardBackgroundColor('MISTAKES');
	const cardBorder = getCardBorderColor('MISTAKES');

	const severityLevel = $derived(CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP[mistake.severity]);
</script>

<div class={cn('feedback-card-container', cardBg, cardBorder)}>
	<div class="feedback-card-header">
		<Badge color="red">{mistake.errorType}</Badge>
		<div class="flex items-center gap-1">
			{#each Array(3) as _, i}
				<div
					class={cn(
						'w-2 h-2 rounded-sm',
						severityLevel > i ? 'bg-red-500 dark:bg-red-400' : 'bg-gray-300 dark:bg-gray-700'
					)}
				></div>
			{/each}
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Phrase:</p>
		<p class="feedback-card-text-box-neutral">"{mistake.phrase}"</p>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Correct form:</p>
		<p class="feedback-card-text-box-green">"{mistake.correctForm}"</p>
	</div>

	<div>
		<p class="feedback-card-label">Explanation:</p>
		<p class="feedback-card-explanation">{mistake.explanation}</p>
	</div>
</div>
