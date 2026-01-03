<script lang="ts">
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { Badge, cn } from 'flowbite-svelte';
	import Score from './components/score.svelte';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import ToggleSidepanelButton from './components/toggle-sidepanel-button.svelte';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base.svelte';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/feedback-metric-icon.svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getFeedbackCriteriaColor } from '$lib/types/conversation/domain/message-feedback-criteria';

	interface FeedbackProps {
		feedback: ConversationUserMessageFeedbackDTO;
	}

	const { feedback }: FeedbackProps = $props();

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened && sidepanelContext.feedbackPreview?.id === feedback.id
	);

	const mistakesCount = feedback.mistakes?.length ?? 0;
	const strengthsCount = feedback.strengths?.length ?? 0;
	const suggestionsCount = feedback.suggestions?.length ?? 0;

	const indicators = $derived.by(() => {
		const items: Array<{
			criteria: MessageFeedbackCriteria;
			count: number;
			label: string;
		}> = [];
		if (mistakesCount > 0)
			items.push({
				criteria: 'MISTAKES',
				count: mistakesCount,
				label: 'Mistakes'
			});
		if (strengthsCount > 0)
			items.push({
				criteria: 'STRENGTHS',
				count: strengthsCount,
				label: 'Strengths'
			});
		if (suggestionsCount > 0)
			items.push({
				criteria: 'SUGGESTIONS',
				count: suggestionsCount,
				label: 'Suggestions'
			});
		return items;
	});

	const getBadgeColor = (criteria: MessageFeedbackCriteria) => {
		return getFeedbackCriteriaColor(criteria);
	};

	const getIconColor = (criteria: MessageFeedbackCriteria) => {
		const color = getFeedbackCriteriaColor(criteria);
		switch (color) {
			case 'red':
				return 'text-red-500 dark:text-red-400';
			case 'green':
				return 'text-green-500 dark:text-green-400';
			case 'blue':
				return 'text-blue-500 dark:text-blue-400';
			default:
				return 'text-gray-500 dark:text-gray-400';
		}
	};

	const getBorderColor = (criteria: MessageFeedbackCriteria) => {
		const color = getFeedbackCriteriaColor(criteria);
		switch (color) {
			case 'red':
				return 'border-red-600 dark:border-red-500';
			case 'green':
				return 'border-green-600 dark:border-green-500';
			case 'blue':
				return 'border-blue-600 dark:border-blue-500';
			default:
				return 'border-gray-400 dark:border-gray-500';
		}
	};
</script>

<AiPostProcessActionBase
	label="Ocena wiadomości"
	class={cn(isSelected ? 'bg-primary-200' : 'bg-primary-100')}
>
	{#if indicators.length > 0}
		<div class="flex flex-row gap-2 flex-wrap">
			{#each indicators as { criteria, count, label }}
				<Badge
					color={getBadgeColor(criteria)}
					class={cn('flex items-center gap-1.5 py-1.5 border', getBorderColor(criteria))}
				>
					<FeedbackMetricIcon {criteria} class={cn('w-3.5 h-3.5', getIconColor(criteria))} />
					<span class="text-xs font-medium">{label}</span>
					<span class="text-xs font-semibold">{count}</span>
				</Badge>
			{/each}
		</div>
	{/if}

	<div class="rounded-md my-2">
		<p class=" leading-[1.8] tracking-wide">
			{feedback.tutorComment}
		</p>
	</div>

	<div class="flex flex-col gap-2">
		<!-- Scores -->
		<Score field="Gramatyka" score={feedback.grammar} />
		<Score field="Słownictwo" score={feedback.vocabulary} />
		<Score field="Naturalność" score={feedback.naturalness} />

		<!-- Feedback Indicators -->
	</div>

	<ToggleSidepanelButton {isSelected} {feedback} />
</AiPostProcessActionBase>
