<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/feedback-metric-icon.svelte';
	import { getLeadingColorForFeedbackMetric } from '$lib/features/conversations/pages/session/utils/get-leading-color-for-feedback-metric';

	interface MetricProps {
		criteria: MessageFeedbackCriteria;
		count: number;
		label: string;
	}

	const { criteria, count, label }: MetricProps = $props();
</script>

{#if count > 0}
	<span
		class={cn(
			'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
			'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
		)}
	>
		<FeedbackMetricIcon
			{criteria}
			class={cn('w-4 h-4', getLeadingColorForFeedbackMetric(criteria))}
		/>

		<span>{label}: <strong class="text-gray-900 dark:text-gray-100">{count}</strong></span>
	</span>
{/if}
