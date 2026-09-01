<script lang="ts">
	import type { ConversationUserMessageAnalysisDTO } from '$conversations/types';
	import type { MessageAnalysisCriteria } from '$conversations/types';
	import {
		getSidepanelContext,
		openSummaryForMessage
	} from '$conversations/pages/session/contexts/sidepanel-context.svelte';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base/ai-post-process-action-base.svelte';
	import HighlightsCountBadge from '$conversations/pages/session/components/shared/highlights-count-badge.svelte';
	import AnalysisMetricIcon from '$conversations/pages/session/components/shared/user-message-analysis/user-message-analysis-metric-icon.svelte';
	import { getUserMessageAnalysisColors } from '$conversations/pages/session/constants/user-message-analysis/colors';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import { Button } from '$lib/components/buttons/button';
	import compact from 'lodash/compact';
	import size from 'lodash/size';
	import * as m from '$lib/paraglide/messages.js';

	interface AnalysisProps {
		analysis: ConversationUserMessageAnalysisDTO | null;
		analysisFailed?: boolean;
		messageIndex: number;
		onRetryAnalysis?: () => void;
	}

	let { analysis, analysisFailed = false, messageIndex, onRetryAnalysis }: AnalysisProps = $props();

	const showAnalysisLoading = $derived(!analysis && !analysisFailed);

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened &&
			sidepanelContext.summaryTab === 'analysis' &&
			sidepanelContext.filterMessageOrder === messageIndex
	);

	const findings = $derived(
		compact([
			size(analysis?.mistakes) > 0 && {
				criteria: 'MISTAKES' as MessageAnalysisCriteria,
				count: size(analysis?.mistakes),
				label: 'Błędy'
			},
			size(analysis?.suggestions) > 0 && {
				criteria: 'SUGGESTIONS' as MessageAnalysisCriteria,
				count: size(analysis?.suggestions),
				label: 'Sugestie'
			},
			size(analysis?.strengths) > 0 && {
				criteria: 'STRENGTHS' as MessageAnalysisCriteria,
				count: size(analysis?.strengths),
				label: 'Mocne strony'
			}
		])
	);
</script>

<AiPostProcessActionBase
	dataTestId={E2E_TEST_IDS.session.messageAnalysis(messageIndex)}
	label="Analiza"
	isGenerating={showAnalysisLoading}
	{isSelected}
	onPreviewContentClick={(e) => {
		const isSameMessageFilter =
			sidepanelContext.summaryTab === 'analysis' &&
			sidepanelContext.filterMessageOrder === messageIndex;

		if (sidepanelContext.isOpened && isSameMessageFilter) {
			sidepanelContext.isOpened = false;
			sidepanelContext.filterMessageOrder = null;
		} else {
			openSummaryForMessage(sidepanelContext, 'analysis', messageIndex);
		}

		(e.target as HTMLElement).blur();
	}}
>
	{#snippet badges()}
		{#each findings as { criteria, count, label } (criteria)}
			{@const { iconColor } = getUserMessageAnalysisColors(criteria)}

			<HighlightsCountBadge {count} {label} {iconColor}>
				{#snippet icon()}
					<AnalysisMetricIcon {criteria} />
				{/snippet}
			</HighlightsCountBadge>
		{/each}
	{/snippet}

	{#if analysisFailed}
		<div class="flex flex-col items-start gap-1.5" role="alert">
			<p class="text-xs text-danger">
				{m['features.conversation.session.analysis.failed']()}
			</p>
			{#if onRetryAnalysis}
				<Button type="OUTLINED" variant="PRIMARY" onClick={onRetryAnalysis}>
					{m['features.conversation.session.analysis.retry']()}
				</Button>
			{/if}
		</div>
	{:else if showAnalysisLoading}
		<div class="text-xs text-ink-muted">
			<TextWithThreeDotsAnimation text="Przygotowywanie analizy" dotsWrapperClass="mb-0.5" />
		</div>
	{/if}
</AiPostProcessActionBase>
