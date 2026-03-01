<script lang="ts">
	import '../../cards.css';
	import type { AIMessageGrammarTip } from '$lib/types/ongoing-conversation/api/responses';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { cn } from 'flowbite-svelte';
	import LearningTipExampleSentence from './shared/learning-tip-example-sentence.svelte';
	import TipRegisterBadge from './shared/tip-register-badge.svelte';
	import AuthUserNativeLanguageFlag from '$lib/components/auth-user-native-language-flag.svelte';

	interface Props {
		tip: AIMessageGrammarTip;
	}

	let { tip }: Props = $props();

	const colors = getAiMessageLearningTipColors('GRAMMAR');
	const GrammarIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['GRAMMAR'];
</script>

<div class={cn('feedback-card-container', colors.cardBg, colors.cardBorder)}>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Phrase:</p>
		<div class="feedback-card-text-box variant-green flex gap-2">
			<GrammarIcon class={cn('w-4 h-4', colors.iconColor)} />
			<span class="flex-1 content-long-sm">{tip.phrase}</span>

			<TipRegisterBadge register={tip.register} color={colors.twColor} />
		</div>

		<div class="feedback-card-text-box variant-neutral flex gap-2 mt-1">
			<AuthUserNativeLanguageFlag class="w-4 h-4" />
			<span class="flex-1 content-long-sm">{tip.nativeLanguageEquivalent}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Grammar Point:</p>
		<div class="feedback-card-text-box variant-neutral">
			<span class="content-long-sm">{tip.grammarPoint}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Explanation:</p>
		<div class="feedback-card-text-box variant-neutral">
			<EXPLANATION_ICON class={cn('w-4 h-4', colors.iconColor)} />
			<span class="content-long-sm">{tip.explanation}</span>
		</div>
	</div>

	<LearningTipExampleSentence exampleSentence={tip.exampleSentences} category="GRAMMAR" />
</div>
