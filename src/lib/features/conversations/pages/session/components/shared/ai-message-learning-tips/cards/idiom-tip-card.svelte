<script lang="ts">
	import '../../cards.css';
	import type { AIMessageIdiomTip } from '$lib/types/ongoing-conversation/api/responses';
	import { getAiMessageLearningTipColors } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';
	import { cn } from 'flowbite-svelte';
	import LearningTipExampleSentence from './shared/learning-tip-example-sentence.svelte';

	interface Props {
		tip: AIMessageIdiomTip;
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

	<div class="feedback-card-section">
		<p class="feedback-card-label">Meaning:</p>
		<div class="feedback-card-text-box variant-blue">
			<span>{tip.meaning}</span>
		</div>
	</div>

	<LearningTipExampleSentence exampleSentence={tip.exampleSentences} />
</div>
