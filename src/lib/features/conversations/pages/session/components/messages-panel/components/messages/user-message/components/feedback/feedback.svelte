<script lang="ts">
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { Badge, cn, Toggle } from 'flowbite-svelte';
	import Score from './components/score.svelte';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import ToggleSidepanelButton from './components/toggle-sidepanel-button.svelte';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base.svelte';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/user-message-feedback/user-message-feedback-metric-icon.svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { getUserMessageFeedbackColors } from '$lib/features/conversations/pages/session/consts/user-message-feedback/colors';

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

	const indicators = $derived.by(() => {
		return compact([
			mistakesCount > 0 && {
				criteria: 'MISTAKES',
				count: mistakesCount,
				label: 'Mistakes'
			},
			strengthsCount > 0 && {
				criteria: 'STRENGTHS',
				count: strengthsCount,
				label: 'Strengths'
			},
			suggestionsCount > 0 && {
				criteria: 'SUGGESTIONS',
				count: suggestionsCount,
				label: 'Suggestions'
			}
		]) satisfies {
			criteria: MessageFeedbackCriteria;
			count: number;
			label: string;
		}[];
	});
</script>

<AiPostProcessActionBase
	label="Analiza wiadomości"
	class={cn(isSelected ? 'bg-primary-200' : 'bg-primary-100')}
>
	{#if indicators.length > 0}
		<div class="flex flex-row gap-2 flex-wrap items-center justify-between">
			<div class="flex flex-row gap-2 flex-wrap">
				{#each indicators as { criteria, count, label }}
					{@const colors = getUserMessageFeedbackColors(criteria)}

					<Badge
						color={colors.twColor}
						class={cn('flex items-center gap-1.5 py-1.5 border', colors.chipBorder)}
					>
						<FeedbackMetricIcon {criteria} class={cn('w-3.5 h-3.5')} />
						<span class="text-xs font-medium">{label}</span>
						<span class="text-xs font-semibold">{count}</span>
					</Badge>
				{/each}
			</div>

			<div class="flex items-center">
				<Toggle
					checked={showIconsInHighlightedParts}
					onchange={() => (showIconsInHighlightedParts = !showIconsInHighlightedParts)}
					size="small"
				>
					<span class="text-sm font-normal">Pokaż ikony</span>
				</Toggle>
			</div>
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

	<ToggleSidepanelButton {isSelected} {feedback} />
</AiPostProcessActionBase>
