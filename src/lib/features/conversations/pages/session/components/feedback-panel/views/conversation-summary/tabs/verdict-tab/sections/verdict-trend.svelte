<script lang="ts">
	import type { CompactConversationUserMessage } from '$conversations/types';
	import type { ConversationMessagePerformanceScore } from '$conversations/types';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import { MetricsLineChart } from '../../overview-tab/sections/metrics-over-time/components';
	import { getMetricLabel, SCORE_METRICS, type ScoreMetric } from '../utils/verdict-utils';

	interface VerdictTrendProps {
		userMessages: CompactConversationUserMessage[];
	}

	const { userMessages }: VerdictTrendProps = $props();

	let selectedMetric = $state<ScoreMetric>('grammar');

	const metricOptions = $derived(
		SCORE_METRICS.map((metric) => ({
			label: getMetricLabel(metric),
			value: metric
		}))
	);

	const chartData = $derived.by(() => {
		if (userMessages.length === 0) {
			return {
				data: [] as (number | null)[],
				categories: [] as string[],
				label: ''
			};
		}

		const label = getMetricLabel(selectedMetric);
		const scoreMetric = selectedMetric satisfies ConversationMessagePerformanceScore;
		const categories = userMessages.map((_, index) => `${index + 1}`);
		const data = userMessages.map((msg) => msg.analysis?.[scoreMetric] ?? null);

		return { data, categories, label };
	});
</script>

{#if userMessages.length > 0}
	<div class="space-y-3">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h4 class="text-xs font-medium uppercase tracking-wide text-ink-muted">Trend</h4>

			<DropdownSelect
				bind:value={selectedMetric}
				options={metricOptions}
				ariaLabel="Wybierz właściwość wykresu"
				buttonClass="w-[148px] shrink-0"
				dropdownClass="w-[148px]"
			/>
		</div>

		<MetricsLineChart
			data={chartData.data}
			categories={chartData.categories}
			metricLabel={chartData.label}
			isScoreMetric={true}
			height={180}
			xAxisLabel="Wiadomość"
		/>
	</div>
{/if}
