<script lang="ts">
	import '../../cards.css';
	import { cn } from 'flowbite-svelte';
	import type { AIMessageVocabularyTip } from '$lib/types/ongoing-conversation/api/responses';
	import {
		getAiMessageLearningTipColors,
		LEARNING_TIP_DEFINITION_ICON
	} from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';
	import LearningTipExampleSentence from './shared/learning-tip-example-sentence.svelte';
	import TipRegisterBadge from './shared/tip-register-badge.svelte';

	interface Props {
		tip: AIMessageVocabularyTip;
	}

	let { tip }: Props = $props();

	const colors = getAiMessageLearningTipColors('VOCABULARY');
</script>

<div class={cn('feedback-card-container', colors.cardBg, colors.cardBorder)}>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Word:</p>
		<div class="feedback-card-text-box variant-neutral flex gap-2">
			<span class="flex-1">{tip.word}</span>

			<TipRegisterBadge register={tip.register} color={colors.twColor} />
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Definition:</p>
		<div class="feedback-card-text-box variant-neutral">
			<LEARNING_TIP_DEFINITION_ICON class={colors.iconColor} />
			<span>{tip.definition}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Usage Note:</p>
		<div class="feedback-card-text-box variant-neutral">
			<span>{tip.usageNote}</span>
		</div>
	</div>

	<LearningTipExampleSentence exampleSentence={tip.exampleSentences} category="VOCABULARY" />
</div>
