<script lang="ts">
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { cn } from 'flowbite-svelte';
	import Score from './components/score.svelte';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base.svelte';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/user-message-feedback/user-message-feedback-metric-icon.svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getUserMessageFeedbackColors } from '$lib/features/conversations/pages/session/consts/user-message-feedback/colors';
	import ToggleIconsInHighlight from '$lib/features/conversations/pages/session/components/shared/toggle-icons-in-highlight.svelte';
	import HighlightsCountBadge from '$lib/features/conversations/pages/session/components/shared/highlights-count-badge.svelte';

	interface FeedbackProps {
		feedback: ConversationUserMessageFeedbackDTO;
		showIconsInHighlightedParts: boolean;
	}

	let {
		feedback, //
		showIconsInHighlightedParts = $bindable()
	}: FeedbackProps = $props();

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened && sidepanelContext.feedbackPreview?.id === feedback.id
	);

	const mistakesCount = size(feedback.mistakes);
	const strengthsCount = size(feedback.strengths);
	const suggestionsCount = size(feedback.suggestions);

	const indicators = compact([
		mistakesCount && {
			criteria: 'MISTAKES',
			count: mistakesCount,
			label: 'Mistakes'
		},
		strengthsCount && {
			criteria: 'STRENGTHS',
			count: strengthsCount,
			label: 'Strengths'
		},
		suggestionsCount && {
			criteria: 'SUGGESTIONS',
			count: suggestionsCount,
			label: 'Suggestions'
		}
	]) satisfies {
		criteria: MessageFeedbackCriteria;
		count: number;
		label: string;
	}[];

	function handleClick() {
		if (isSelected) {
			sidepanelContext.isOpened = false;
			sidepanelContext.feedbackPreview = null;
			return;
		}

		sidepanelContext.isOpened = true;
		sidepanelContext.feedbackPreview = feedback;
	}
</script>

<AiPostProcessActionBase
	label="Analiza wiadomości"
	class={cn(isSelected ? 'bg-primary-200' : 'bg-primary-100')}
	onclick={handleClick}
>
	{#if indicators.length > 0}
		<div class="flex flex-row gap-2 flex-wrap items-center justify-between">
			<div class="flex flex-row gap-2 flex-wrap">
				{#each indicators as { criteria, count, label }}
					{@const { twColor, chipBorder } = getUserMessageFeedbackColors(criteria)}

					<HighlightsCountBadge {count} {label} color={twColor} class={chipBorder}>
						{#snippet icon()}
							<FeedbackMetricIcon {criteria} />
						{/snippet}
					</HighlightsCountBadge>
				{/each}
			</div>

			<ToggleIconsInHighlight bind:checked={showIconsInHighlightedParts} />
		</div>
	{/if}

	<div class="rounded-md my-2">
		<p class=" leading-[1.8] tracking-wide">
			{feedback.tutorComment}
		</p>
	</div>

	<div class="flex flex-col gap-2">
		<Score field="Gramatyka" score={feedback.grammar} />
		<Score field="Słownictwo" score={feedback.vocabulary} />
		<Score field="Naturalność" score={feedback.naturalness} />
	</div>
</AiPostProcessActionBase>
