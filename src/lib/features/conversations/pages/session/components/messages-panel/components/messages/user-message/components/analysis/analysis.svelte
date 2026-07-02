<script lang="ts">
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import type { ConversationUserMessageAnalysisDTO } from '$lib/types/conversation/domain/conversation-message-analysis';
	import { RoundedBoxesScore } from '$lib/components/scores';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base/ai-post-process-action-base.svelte';
	import AnalysisMetricIcon from '$lib/features/conversations/pages/session/components/shared/user-message-analysis/user-message-analysis-metric-icon.svelte';
	import type { MessageAnalysisCriteria } from '$lib/types/conversation/domain/message-analysis-criteria';
	import { getUserMessageAnalysisColors } from '$conversations/pages/session/constants/user-message-analysis/colors';
	import HighlightsCountBadge from '$lib/features/conversations/pages/session/components/shared/highlights-count-badge.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';

	interface AnalysisProps {
		analysis: ConversationUserMessageAnalysisDTO | null;
		showIconsInHighlightedParts: boolean;
	}

	let {
		analysis, //
		showIconsInHighlightedParts = $bindable()
	}: AnalysisProps = $props();

	const showAnalysisLoading = $derived(!analysis);

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened && sidepanelContext.analysisPreview?.id === analysis?.id
	);

	const mistakesCount = $derived(size(analysis?.mistakes));
	const strengthsCount = $derived(size(analysis?.strengths));
	const suggestionsCount = $derived(size(analysis?.suggestions));

	const indicators = $derived(
		compact([
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
			criteria: MessageAnalysisCriteria;
			count: number;
			label: string;
		}[]
	);
</script>

<AiPostProcessActionBase
	label="Analiza wiadomości"
	isGenerating={showAnalysisLoading}
	bind:showIconsInHighlightedParts
	{isSelected}
	enableExpandCollapse
	onPreviewContentClick={(e) => {
		const isTheSameAnalysisClickedAgain = sidepanelContext.analysisPreview?.id === analysis?.id;

		if (isTheSameAnalysisClickedAgain) {
			sidepanelContext.isOpened = false;

			setTimeout(() => {
				sidepanelContext.analysisPreview = null;
			}, 300);
		} else {
			sidepanelContext.isOpened = true;
			sidepanelContext.analysisPreview = analysis;
			sidepanelContext.learningTipsPreviewMessageOrder = null;
		}

		(e.target as HTMLElement).blur();
	}}
>
	{#snippet badges()}
		{#each indicators as { criteria, count, label } (criteria)}
			{@const { iconColor } = getUserMessageAnalysisColors(criteria)}

			<HighlightsCountBadge {count} {label} {iconColor} class="">
				{#snippet icon()}
					<AnalysisMetricIcon {criteria} />
				{/snippet}
			</HighlightsCountBadge>
		{/each}
	{/snippet}

	{#if analysis}
		<div class="rounded-md mt-2 p-2">
			<p class="content-long">
				{analysis.tutorComment}
			</p>
		</div>

		<div class="flex gap-1 items-start">
			<RoundedBoxesScore field="Gramatyka" score={analysis.grammar} />
			<RoundedBoxesScore field="Słownictwo" score={analysis.vocabulary} />
			<RoundedBoxesScore field="Naturalność" score={analysis.naturalness} />
		</div>
	{:else if showAnalysisLoading}
		<TextWithThreeDotsAnimation
			text="Trwa przygotowywanie materiałów edukacyjnych"
			dotsWrapperClass="mb-1"
		/>
	{/if}
</AiPostProcessActionBase>
