<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type { ConversationMessageSuggestion } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { getCardBackgroundColor, getCardBorderColor } from '../feedback-panel-colors.utils';
	import './feedback-card-classes.css';

	interface Props {
		suggestion: ConversationMessageSuggestion;
	}

	let { suggestion }: Props = $props();

	const cardBg = getCardBackgroundColor('SUGGESTIONS');
	const cardBorder = getCardBorderColor('SUGGESTIONS');
</script>

<div class={cn('feedback-card-container', cardBg, cardBorder)}>
	<div class="feedback-card-header">
		<Badge color="purple">{suggestion.suggestionType}</Badge>
	</div>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Original:</p>
		<p class="feedback-card-text-box-neutral">"{suggestion.original}"</p>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Alternatives:</p>
		<ul class="list-disc list-inside space-y-2 ml-2">
			{#each suggestion.alternatives as alternative}
				<li class="feedback-card-text-box-blue">"{alternative}"</li>
			{/each}
		</ul>
	</div>

	{#if suggestion.explanation}
		<div>
			<p class="feedback-card-label">Explanation:</p>
			<p class="feedback-card-explanation">{suggestion.explanation}</p>
		</div>
	{/if}
</div>
