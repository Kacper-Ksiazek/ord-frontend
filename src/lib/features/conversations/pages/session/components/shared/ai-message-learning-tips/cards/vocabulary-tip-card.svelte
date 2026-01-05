<script lang="ts">
	import '../../cards.css';
	import { Badge, cn } from 'flowbite-svelte';
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import { getAiMessageLearningTipColors } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';

	interface Props {
		tip: AIMessageLearningTips['vocabularyTips'][number];
	}

	let { tip }: Props = $props();

	const colors = getAiMessageLearningTipColors('VOCABULARY');
</script>

<div class={cn('feedback-card-container', colors.cardBg, colors.cardBorder)}>
	<div class="feedback-card-header">
		{#if tip.proficiencyLevel}
			<Badge color={colors.twColor}>Level: {tip.proficiencyLevel}</Badge>
		{/if}
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Word:</p>
		<div class="feedback-card-text-box variant-neutral">
			<span>{tip.word}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Definition:</p>
		<div class="feedback-card-text-box variant-blue">
			<span>{tip.definition}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Usage Note:</p>
		<div class="feedback-card-text-box variant-blue">
			<span>{tip.usageNote}</span>
		</div>
	</div>
</div>
