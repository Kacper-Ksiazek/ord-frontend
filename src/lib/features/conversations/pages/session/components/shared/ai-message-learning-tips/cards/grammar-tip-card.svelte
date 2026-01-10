<script lang="ts">
	import '../../cards.css';
	import type { AIMessageGrammarTip } from '$lib/types/ongoing-conversation/api/responses';
	import {
		getAiMessageLearningTipColors,
		LEARNING_TIP_DEFINITION_ICON
	} from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';
	import { cn } from 'flowbite-svelte';
	import LearningTipExampleSentence from './shared/learning-tip-example-sentence.svelte';

	interface Props {
		tip: AIMessageGrammarTip;
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
		<div class="feedback-card-text-box variant-green">
			<span>{tip.grammarPoint}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Explanation:</p>
		<div class="feedback-card-text-box variant-neutral">
			<LEARNING_TIP_DEFINITION_ICON class={colors.iconColor} />
			<span>{tip.explanation}</span>
		</div>
	</div>

	<LearningTipExampleSentence exampleSentence={tip.exampleSentences} category="GRAMMAR" />
</div>
