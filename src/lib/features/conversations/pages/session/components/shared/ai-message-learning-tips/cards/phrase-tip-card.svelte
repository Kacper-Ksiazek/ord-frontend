<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type {
		AIMessagePhraseTip,
		PhraseType
	} from '$lib/types/ongoing-conversation/api/responses';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import { PHRASE_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/subcategory-icons';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import LearningTipExampleSentence from './shared/learning-tip-example-sentence.svelte';
	import TipRegisterBadge from './shared/tip-register-badge.svelte';
	import AuthUserNativeLanguageFlag from '$lib/components/auth-user-native-language-flag.svelte';
	import AIAdviceCard from '../../ai-advice-card.svelte';

	interface Props {
		tip: AIMessagePhraseTip;
	}

	let { tip }: Props = $props();

	const colors = getAiMessageLearningTipColors('PHRASES');
	const PhraseIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['PHRASES'];
	const PhraseTypeIcon = PHRASE_TYPE_ICONS_MAP[tip.phraseType];

	function getPhraseTypeLabel(phraseType: PhraseType): string {
		return phraseType === 'IDIOMATIC' ? 'Idiomatic' : 'Literal';
	}
</script>

<AIAdviceCard cardBg={colors.cardBg} cardBorder={colors.cardBorder}>
	{#snippet header()}
		<div class="feedback-card-section">
			<p class="feedback-card-label">Phrase:</p>

			<div class="feedback-card-text-box variant-purple flex gap-2">
				<PhraseIcon class={cn('w-4 h-4', colors.iconColor)} />
				<span class="flex-1 content-long-sm">{tip.phrase}</span>

				<Badge color={colors.twColor} class="flex items-center gap-1">
					<PhraseTypeIcon class="w-4 h-4" />
					{getPhraseTypeLabel(tip.phraseType)}
				</Badge>
				<TipRegisterBadge register={tip.register} color={colors.twColor} />
			</div>

			<div class="feedback-card-text-box variant-neutral flex gap-2 mt-1">
				<AuthUserNativeLanguageFlag class="w-4 h-4" />
				<span class="flex-1 content-long-sm">{tip.nativeLanguageEquivalent}</span>
			</div>
		</div>
	{/snippet}

	<div class="feedback-card-section">
		<p class="feedback-card-label">Meaning:</p>
		<div class="feedback-card-text-box variant-neutral">
			<EXPLANATION_ICON class={cn('w-4 h-4', colors.iconColor)} />
			<span class="content-long-sm">{tip.meaning}</span>
		</div>
	</div>

	<LearningTipExampleSentence exampleSentence={tip.exampleSentences} category="PHRASES" />
</AIAdviceCard>
