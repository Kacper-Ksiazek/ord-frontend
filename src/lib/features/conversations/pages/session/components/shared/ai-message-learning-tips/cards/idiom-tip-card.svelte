<script lang="ts">
	import '../../cards.css';
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import { getAiMessageLearningTipColors } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';
	import { cn } from 'flowbite-svelte';

	interface Props {
		tip: AIMessageLearningTips['idiomTips'][number];
	}

	let { tip }: Props = $props();

	const colors = getAiMessageLearningTipColors('IDIOMS');
</script>

<div class={cn('feedback-card-container', colors.cardBg, colors.cardBorder)}>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Phrase:</p>
		<div class="feedback-card-text-box variant-neutral">
			<span>{tip.phrase}</span>
		</div>
	</div>

	{#if tip.meaning}
		<div class="feedback-card-section">
			<p class="feedback-card-label">Meaning:</p>
			<div class="feedback-card-text-box variant-blue">
				<span>{tip.meaning}</span>
			</div>
		</div>
	{/if}

	{#if tip.example}
		<div>
			<p class="feedback-card-label">Example:</p>
			<p class="feedback-card-explanation italic">{tip.example}</p>
		</div>
	{/if}
</div>
