<script lang="ts">
	import '../../cards.css';
	import { cn } from 'flowbite-svelte';
	import type { AIMessageVocabularyTip } from '$lib/types/ongoing-conversation/api/responses';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import LearningTipExampleSentence from './shared/learning-tip-example-sentence.svelte';
	import TipRegisterBadge from './shared/tip-register-badge.svelte';
	import AuthUserNativeLanguageFlag from '$lib/components/auth-user-native-language-flag.svelte';

	interface Props {
		tip: AIMessageVocabularyTip;
	}

	let { tip }: Props = $props();

	const colors = getAiMessageLearningTipColors('VOCABULARY');
	const VocabularyIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['VOCABULARY'];
</script>

<div class={cn('feedback-card-container', colors.cardBg, colors.cardBorder)}>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Word:</p>
		<div class="feedback-card-text-box variant-blue flex gap-2">
			<VocabularyIcon class={cn('w-4 h-4', colors.iconColor)} />
			<span class="flex-1 content-long-sm">{tip.word}</span>

			<TipRegisterBadge register={tip.register} color={colors.twColor} />
		</div>

		<div class="feedback-card-text-box variant-neutral flex gap-2 mt-1">
			<AuthUserNativeLanguageFlag class="w-4 h-4" />
			<span class="flex-1 content-long-sm">{tip.nativeLanguageEquivalent}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Definition:</p>
		<div class="feedback-card-text-box variant-neutral">
			<EXPLANATION_ICON class={cn('w-4 h-4', colors.iconColor)} />
			<span class="content-long-sm">{tip.definition}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Usage Note:</p>
		<div class="feedback-card-text-box variant-neutral">
			<span class="content-long-sm">{tip.usageNote}</span>
		</div>
	</div>

	<LearningTipExampleSentence exampleSentence={tip.exampleSentences} category="VOCABULARY" />
</div>
