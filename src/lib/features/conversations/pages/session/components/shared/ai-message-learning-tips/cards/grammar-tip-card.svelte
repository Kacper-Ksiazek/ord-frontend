<script lang="ts">
	import '../../cards.css';
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import { getAiMessageLearningTipColors } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';
	import { cn } from 'flowbite-svelte';

	interface Props {
		tip: AIMessageLearningTips['grammarTips'][number];
	}

	let { tip }: Props = $props();

	const colors = getAiMessageLearningTipColors('GRAMMAR');
</script>

<div class={cn('feedback-card-container', colors.cardBg, colors.cardBorder)}>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Phrase:</p>
		<div class="feedback-card-text-box variant-neutral">
			<span>{tip.phrase}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Grammar Point:</p>
		<div class="feedback-card-text-box variant-blue">
			<span>{tip.grammarPoint}</span>
		</div>
	</div>

	<div>
		<p class="feedback-card-label">Explanation:</p>
		<p class="feedback-card-explanation">{tip.explanation}</p>
	</div>
</div>
