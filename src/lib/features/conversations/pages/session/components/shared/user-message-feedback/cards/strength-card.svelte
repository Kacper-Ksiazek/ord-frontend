<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type { ConversationMessageStrength } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { getUserMessageFeedbackColors } from '$conversations/pages/session/constants/user-message-feedback/colors';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import AIAdviceCard from '../../ai-advice-card.svelte';

	interface Props {
		strength: ConversationMessageStrength;
	}

	let { strength }: Props = $props();

	const { cardBg, cardBorder, twColor, iconColor } = getUserMessageFeedbackColors('STRENGTHS');
	const StrengthIcon = USER_MESSAGE_FEEDBACK_ICONS_MAP['STRENGTHS'];
</script>

<AIAdviceCard {cardBg} {cardBorder}>
	{#snippet header()}
		<div class="feedback-card-section">
			<p class="feedback-card-label">Phrase:</p>
			<div class="feedback-card-text-box variant-green">
				<StrengthIcon class={cn('w-4 h-4', iconColor)} />
				<span class="flex-1 content-long-sm">{strength.phrase}</span>

				<Badge color={twColor}>{strength.strengthType}</Badge>
			</div>
		</div>
	{/snippet}

	<div class="feedback-card-section">
		<p class="feedback-card-label">Explanation:</p>
		<div class="feedback-card-text-box variant-neutral">
			<EXPLANATION_ICON class={cn('w-4 h-4', iconColor)} />
			<span class="content-long-sm">{strength.explanation}</span>
		</div>
	</div>
</AIAdviceCard>
