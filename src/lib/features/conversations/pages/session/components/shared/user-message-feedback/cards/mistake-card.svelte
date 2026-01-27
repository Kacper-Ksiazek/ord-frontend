<script lang="ts">
	import '../../cards.css';
	import { Badge, cn } from 'flowbite-svelte';
	import {
		CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP,
		type ConversationMessageMistake
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import { Check, X } from 'lucide-svelte';
	import { getUserMessageFeedbackColors } from '$lib/features/conversations/pages/session/consts/user-message-feedback/colors';

	interface Props {
		mistake: ConversationMessageMistake;
	}

	let { mistake }: Props = $props();

	const { cardBg, cardBorder, twColor, iconColor } = getUserMessageFeedbackColors('MISTAKES');

	const severityLevel = CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP[mistake.severity];
	const severityLabel = mistake.severity.charAt(0) + mistake.severity.slice(1).toLowerCase();
</script>

<div class={cn('feedback-card-container', cardBg, cardBorder)}>
	<div class="feedback-card-header">
		<Badge color={twColor}>{mistake.errorType}</Badge>

		<div class="flex flex-col items-center gap-0.5">
			<div class="flex items-center gap-1">
				{#each Array(3) as _, i}
					<div
						class={cn(
							'w-2.5 h-2.5 rounded-sm',
							severityLevel > i ? 'bg-red-600 dark:bg-red-400' : 'bg-gray-300 dark:bg-gray-700'
						)}
					></div>
				{/each}
			</div>
			<span class="text-xs text-gray-600 dark:text-gray-400">{severityLabel}</span>
		</div>
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

	<div>
		<p class="feedback-card-label">Explanation:</p>
		<p class="feedback-card-explanation">{mistake.explanation}</p>
	</div>
</div>
