<script lang="ts">
	import '../../cards.css';
	import { Badge, cn } from 'flowbite-svelte';
	import type { ConversationMessageMistake } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { Check, X } from 'lucide-svelte';
	import { getUserMessageFeedbackColors } from '$lib/features/conversations/pages/session/consts/user-message-feedback/colors';
	import { EXPLANATION_ICON } from '$lib/features/conversations/pages/session/consts/icons';
	import { MistakeSeverityIndicator } from '$lib/components/scores';

	interface Props {
		mistake: ConversationMessageMistake;
	}

	let { mistake }: Props = $props();

	const { cardBg, cardBorder, twColor, iconColor } = getUserMessageFeedbackColors('MISTAKES');
</script>

<div class={cn('feedback-card-container', cardBg, cardBorder)}>
	<div class="feedback-card-header">
		<Badge color={twColor}>{mistake.errorType}</Badge>

		<MistakeSeverityIndicator severity={mistake.severity} />
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Phrase:</p>
		<div class="feedback-card-text-box variant-red">
			<X class={iconColor} />
			<span>{mistake.phrase}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Correct form:</p>
		<div class="feedback-card-text-box variant-green">
			<Check class={getUserMessageFeedbackColors('STRENGTHS').iconColor} />
			<span>{mistake.correctForm}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Explanation:</p>
		<div class="feedback-card-text-box variant-neutral">
			<EXPLANATION_ICON class={iconColor} />
			<span>{mistake.explanation}</span>
		</div>
	</div>
</div>
