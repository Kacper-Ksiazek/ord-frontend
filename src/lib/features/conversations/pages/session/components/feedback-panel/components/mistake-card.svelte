<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type {
		ConversationMessageMistake,
		ConversationMessageMistakeSeverity
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import {
		getCardBackgroundColor,
		getCardBorderColor,
		getSeverityLevel
	} from '../feedback-panel-colors.utils';
	import './feedback-card-classes.css';

	interface Props {
		mistake: ConversationMessageMistake;
	}

	let { mistake }: Props = $props();

	$inspect(mistake);

	const cardBg = getCardBackgroundColor('MISTAKES');
	const cardBorder = getCardBorderColor('MISTAKES');

	const severityLevel = $derived(getSeverityLevel(mistake.severity));
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
