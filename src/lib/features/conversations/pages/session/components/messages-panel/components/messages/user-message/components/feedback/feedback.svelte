<script lang="ts">
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { cn } from 'flowbite-svelte';
	import { RoundedBoxesScore } from '$lib/components/scores';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base.svelte';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/user-message-feedback/user-message-feedback-metric-icon.svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getUserMessageFeedbackColors } from '$conversations/pages/session/constants/user-message-feedback/colors';
	import ToggleIconsInHighlight from '$lib/features/conversations/pages/session/components/shared/toggle-icons-in-highlight.svelte';
	import HighlightsCountBadge from '$lib/features/conversations/pages/session/components/shared/highlights-count-badge.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';

	interface FeedbackProps {
		feedback: ConversationUserMessageFeedbackDTO | null;
		showIconsInHighlightedParts: boolean;
	}

	let {
		feedback, //
		showIconsInHighlightedParts = $bindable()
	}: FeedbackProps = $props();

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened && sidepanelContext.feedbackPreview?.id === feedback?.id
	);

	const mistakesCount = size(feedback?.mistakes);
	const strengthsCount = size(feedback?.strengths);
	const suggestionsCount = size(feedback?.suggestions);

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
	tooltipContent="Kliknij, aby otworzyć podsumowanie wiadomości"
	tooltipPlacement="left-start"
	class={cn(isSelected && 'ring-2 ring-primary-300')}
	onclick={handleClick}
	isGenerating={!feedback}
>
	{#if feedback}
		{#if indicators.length > 0}
			<div class="flex flex-row gap-2 items-center justify-between">
				<div class="flex flex-row gap-2 overflow-x-auto min-w-0">
					{#each indicators as { criteria, count, label } (criteria)}
						{@const { iconColor } = getUserMessageFeedbackColors(criteria)}

						<HighlightsCountBadge {count} {label} {iconColor} class="">
							{#snippet icon()}
								<FeedbackMetricIcon {criteria} />
							{/snippet}
						</HighlightsCountBadge>
					{/each}
				</div>

				<ToggleIconsInHighlight bind:checked={showIconsInHighlightedParts} />
			</div>
		{/if}

		<div class="rounded-md my-2 p-2 text-content-card">
			<p class="leading-[1.8] tracking-wide">
				{feedback.tutorComment}
			</p>
		</div>

		<div class="flex flex-col gap-2 items-start">
			<RoundedBoxesScore field="Gramatyka" score={feedback.grammar} />
			<RoundedBoxesScore field="Słownictwo" score={feedback.vocabulary} />
			<RoundedBoxesScore field="Naturalność" score={feedback.naturalness} />
		</div>
	{:else}
		<TextWithThreeDotsAnimation
			text="Trwa przygotowywanie materiałów edukacyjnych"
			dotsWrapperClass="mb-1"
		/>
	{/if}
</AiPostProcessActionBase>
