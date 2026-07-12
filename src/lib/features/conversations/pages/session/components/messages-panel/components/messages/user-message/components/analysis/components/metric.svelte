<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { MessageAnalysisCriteria } from '$conversations/types';
	import AnalysisMetricIcon from '$conversations/pages/session/components/shared/user-message-analysis/user-message-analysis-metric-icon.svelte';
	import { getUserMessageAnalysisColors } from '$conversations/pages/session/constants/user-message-analysis/colors';

	interface MetricProps {
		criteria: MessageAnalysisCriteria;
		count: number;
		label: string;
	}

	const { criteria, count, label }: MetricProps = $props();
</script>

{#if count > 0}
	<span
		class={cn(
			'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border border-gray-200 dark:border-gray-700',
			'bg-gray-50 dark:bg-gray-800 caption'
		)}
	>
		<AnalysisMetricIcon
			{criteria}
			class={cn('w-4 h-4', getUserMessageAnalysisColors(criteria).text)}
		/>

		<span>{label}: <strong class="text-strong">{count}</strong></span>
	</span>
{/if}
