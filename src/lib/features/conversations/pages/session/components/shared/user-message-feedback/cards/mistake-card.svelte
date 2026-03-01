<script lang="ts">
	import '../../cards.css';
	import { Badge, cn } from 'flowbite-svelte';
	import type { ConversationMessageMistake } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { Check, X } from 'lucide-svelte';
	import { getUserMessageFeedbackColors } from '$conversations/pages/session/constants/user-message-feedback/colors';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { MISTAKE_SEVERITY_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import { MistakeSeverityIndicator } from '$lib/components/scores';

	interface Props {
		mistake: ConversationMessageMistake;
	}

	let { mistake }: Props = $props();

	const { cardBg, cardBorder, twColor, iconColor } = getUserMessageFeedbackColors('MISTAKES');
	const SeverityIcon = MISTAKE_SEVERITY_ICONS_MAP[mistake.severity];
</script>

<div class={cn('feedback-card-container', cardBg, cardBorder)}>
	<div class="feedback-card-header">
		<Badge color={twColor}>{mistake.errorType}</Badge>

		<div class="flex items-start gap-2">
			<SeverityIcon class={cn('w-5 h-5 mt-0.5', iconColor)} />
			<MistakeSeverityIndicator severity={mistake.severity} />
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Phrase:</p>
		<div class="feedback-card-text-box variant-red">
			<X class={cn('w-4 h-4', iconColor)} />
			<span class="content-long-sm">{mistake.phrase}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Correct form:</p>
		<div class="feedback-card-text-box variant-green">
			<Check class={cn('w-4 h-4', getUserMessageFeedbackColors('STRENGTHS').iconColor)} />
			<span class="content-long-sm">{mistake.correctForm}</span>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Explanation:</p>
		<div class="feedback-card-text-box variant-neutral">
			<EXPLANATION_ICON class={cn('w-4 h-4', iconColor)} />
			<span class="content-long-sm">{mistake.explanation}</span>
		</div>
	</div>
</div>
