<script lang="ts">
	import '../../cards.css';
	import { Badge, cn } from 'flowbite-svelte';
	import type {
		AIMessagePhraseTip,
		PhraseType
	} from '$lib/types/ongoing-conversation/api/responses';
	import { getAiMessageLearningTipColors } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/icons';
	import { EXPLANATION_ICON } from '$lib/features/conversations/pages/session/consts/icons';
	import LearningTipExampleSentence from './shared/learning-tip-example-sentence.svelte';
	import TipRegisterBadge from './shared/tip-register-badge.svelte';
	import AuthUserNativeLanguageFlag from '$lib/components/auth-user-native-language-flag.svelte';

	interface Props {
		tip: AIMessagePhraseTip;
	}

	let { tip }: Props = $props();

	const colors = getAiMessageLearningTipColors('PHRASES');
	const PhraseIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['PHRASES'];

	function getPhraseTypeLabel(phraseType: PhraseType): string {
		return phraseType === 'IDIOMATIC' ? 'Idiomatic' : 'Literal';
	}
</script>

<div class={cn('feedback-card-container', colors.cardBg, colors.cardBorder)}>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Phrase:</p>

		<div class="feedback-card-text-box variant-purple flex gap-2">
			<PhraseIcon class={colors.iconColor} />
			<span class="flex-1">{tip.phrase}</span>

			<Badge color={colors.twColor}>{getPhraseTypeLabel(tip.phraseType)}</Badge>
			<TipRegisterBadge register={tip.register} color={colors.twColor} />
		</div>

		<div class="feedback-card-text-box variant-neutral flex gap-2 mt-1">
			<AuthUserNativeLanguageFlag class="w-4 h-4" />
			<span class="flex-1">{tip.nativeLanguageEquivalent}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Meaning:</p>
		<div class="feedback-card-text-box variant-neutral">
			<EXPLANATION_ICON class={colors.iconColor} />
			<span>{tip.meaning}</span>
		</div>
	</div>

	<LearningTipExampleSentence exampleSentence={tip.exampleSentences} category="PHRASES" />
</div>
