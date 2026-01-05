<script lang="ts">
	import './user-message-feedback-cards.css';
	import { Badge, cn } from 'flowbite-svelte';
	import type { ConversationMessageSuggestion } from '$lib/types/conversation/domain/conversation-message-feedback';
	import {
		getCardBackgroundColor,
		getCardBorderColor
	} from '../../../utils/get-user-message-feedback-colors';
	import { ArrowRight } from 'lucide-svelte';

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
		<div class="feedback-card-text-box variant-neutral">
			<span>{suggestion.original}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Alternatives:</p>
		<ul class="space-y-2">
			{#each suggestion.alternatives as alternative}
				<li class="feedback-card-text-box variant-blue">
					<ArrowRight class="text-blue-600 dark:text-blue-400" />
					<span>{alternative}</span>
				</li>
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
