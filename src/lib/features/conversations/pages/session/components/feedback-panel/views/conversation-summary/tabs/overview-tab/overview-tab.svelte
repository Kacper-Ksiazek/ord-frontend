<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { ConversationSummaryData } from '../conversation-summary-tabs.types';
	import { MessageStatistics, MistakesSeverity, PerformanceScores } from './sections';

	interface Props {
		data: ConversationSummaryData;
	}

	let { data }: Props = $props();
</script>

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
	<MessageStatistics userMessages={data.userMessages} aiMessages={data.aiMessages} />

	<PerformanceScores userMessages={data.userMessages} feedbacks={data.feedbacks} />

	<!-- Mistake Severity Summary -->
	<MistakesSeverity feedbacks={data.feedbacks} />
	<!-- Empty State -->
	{#if isEmpty(data.feedbacks) && data.totalLearningTips === 0}
		<div class="text-center py-8 text-muted">
			<p>No data available yet.</p>
			<p class="text-muted-small mt-2">Send messages to receive feedback and see statistics here.</p>
		</div>
	{/if}
</ScrollableWrapper>
