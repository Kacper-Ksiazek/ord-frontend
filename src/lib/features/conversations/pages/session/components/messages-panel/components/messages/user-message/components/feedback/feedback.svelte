<script lang="ts">
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { RoundedBoxesScore } from '$lib/components/scores';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base/ai-post-process-action-base.svelte';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/user-message-feedback/user-message-feedback-metric-icon.svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getUserMessageFeedbackColors } from '$conversations/pages/session/constants/user-message-feedback/colors';
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
</script>

<AiPostProcessActionBase
	label="Analiza wiadomości"
	bind:showIconsInHighlightedParts
	{isSelected}
	enableExpandCollapse
	onPreviewContentClick={() => {
		sidepanelContext.feedbackPreview = feedback;
	}}
>
	{#snippet badges()}
		{#each indicators as { criteria, count, label } (criteria)}
			{@const { iconColor } = getUserMessageFeedbackColors(criteria)}

			<HighlightsCountBadge {count} {label} {iconColor} class="">
				{#snippet icon()}
					<FeedbackMetricIcon {criteria} />
				{/snippet}
			</HighlightsCountBadge>
		{/each}
	{/snippet}

	{#if feedback}
		<div class="rounded-md mt-2 p-2">
			<p class="content-long">
				{feedback.tutorComment}
			</p>
		</div>

		<div class="flex gap-1 items-start">
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
