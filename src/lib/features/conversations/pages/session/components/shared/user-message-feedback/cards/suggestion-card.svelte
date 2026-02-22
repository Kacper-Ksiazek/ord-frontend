<script lang="ts">
	import '../../cards.css';
	import { Badge, cn } from 'flowbite-svelte';
	import type { ConversationMessageSuggestion } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { ArrowRight } from 'lucide-svelte';
	import { getUserMessageFeedbackColors } from '$conversations/pages/session/constants/user-message-feedback/colors';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';
	import { SUGGESTION_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';

	interface Props {
		suggestion: ConversationMessageSuggestion;
	}

	let { suggestion }: Props = $props();

	const { cardBg, cardBorder, twColor, iconColor } = getUserMessageFeedbackColors('SUGGESTIONS');
	const SuggestionIcon = USER_MESSAGE_FEEDBACK_ICONS_MAP['SUGGESTIONS'];
	const SuggestionTypeIcon = SUGGESTION_TYPE_ICONS_MAP[suggestion.suggestionType];
</script>

<div class={cn('feedback-card-container', cardBg, cardBorder)}>
	<div class="feedback-card-section">
		<p class="feedback-card-label">Original:</p>
		<div class="feedback-card-text-box variant-blue">
			<SuggestionIcon class={iconColor} />
			<span class="flex-1">{suggestion.original}</span>

			<Badge color={twColor} class="flex items-center gap-1">
				<SuggestionTypeIcon class="w-3 h-3" />
				{suggestion.suggestionType}
			</Badge>
		</div>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Alternatives:</p>
		<ul class="space-y-2">
			{#each suggestion.alternatives as alternative}
				<li class="feedback-card-text-box variant-neutral">
					<ArrowRight class={iconColor} />
					<span>{alternative}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="feedback-card-section">
		<p class="feedback-card-label">Explanation:</p>
		<div class="feedback-card-text-box variant-neutral">
			<EXPLANATION_ICON class={iconColor} />
			<span>{suggestion.explanation}</span>
		</div>
	</div>
</div>
