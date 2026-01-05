<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type { ConversationMessageStrength } from '$lib/types/conversation/domain/conversation-message-feedback';
	import {
		getCardBackgroundColor,
		getCardBorderColor
	} from '../../../utils/get-user-message-feedback-colors';
	import './user-message-feedback-cards.css';
	import { ThumbsUp } from 'lucide-svelte';

	interface Props {
		strength: ConversationMessageStrength;
	}

	let { strength }: Props = $props();

	const cardBg = getCardBackgroundColor('STRENGTHS');
	const cardBorder = getCardBorderColor('STRENGTHS');
</script>

<div class={cn('feedback-card-container', cardBg, cardBorder)}>
	<div class="feedback-card-header">
		<Badge color="green">{strength.strengthType}</Badge>
	</div>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Phrase:</p>
		<div class="feedback-card-text-box variant-neutral">
			<ThumbsUp class="text-green-600 dark:text-green-400" />
			<span>{strength.phrase}</span>
		</div>
	</div>
	{#if strength.explanation}
		<div>
			<p class="feedback-card-label">Explanation:</p>
			<p class="feedback-card-explanation">{strength.explanation}</p>
		</div>
	{/if}
</div>
