<script lang="ts">
	import type { ConversationMessagePerformanceScore } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import { MetricsLineChart } from './components';
	import { METRIC_OPTIONS, type MetricsOverTimeProperty } from './metrics-over-time.types';

	interface Props {
		userMessages: CompactConversationUserMessage[];
	}

	const { userMessages }: Props = $props();

	let selectedMetric = $state<MetricsOverTimeProperty>('grammar');

	const metricOptions = $derived(
		METRIC_OPTIONS.map((opt) => ({
			label: opt.label,
			value: opt.value
		}))
	);

	const chartData = $derived.by(() => {
		if (userMessages.length === 0) {
			return { data: [], categories: [], label: '' };
		}

		const selectedOption = METRIC_OPTIONS.find((opt) => opt.value === selectedMetric);
		const label = selectedOption?.label ?? '';

		const categories = userMessages.map((_, index) => `${index + 1}`);

		let data: (number | null)[];
		if (selectedMetric === 'avgCharacters') {
			// Character count per message
			data = userMessages.map((msg) => msg.content.length);
		} else {
			// Grammar, Vocabulary, or Naturalness scores
			const scoreMetric: ConversationMessagePerformanceScore = selectedMetric;
			data = userMessages.map((msg) => {
				if (!msg.feedback) return null;

				return msg.feedback[scoreMetric] ?? null;
			});
		}

		const isScoreMetric = selectedMetric !== 'avgCharacters';

		const validValues = data.filter((v): v is number => v !== null);
		const average =
			validValues.length > 0 ? validValues.reduce((sum, v) => sum + v, 0) / validValues.length : null;

		return { data, categories, label, isScoreMetric, average };
	});

	const hasData = $derived(userMessages.length > 0);
</script>

{#if hasData}
	<div class="space-y-4">
		<div class="flex items-center gap-2">
			<h3 class="heading-5">Metrics Over Time</h3>
			<span class="text-gray-500">-</span>
			<DropdownSelect
				bind:value={selectedMetric}
				options={metricOptions}
				ariaLabel="Select metric"
				buttonClass="w-[160px]"
			/>
		</div>

		<MetricsLineChart
			data={chartData.data}
			categories={chartData.categories}
			metricLabel={chartData.label}
			isScoreMetric={chartData.isScoreMetric}
			average={chartData.average}
		/>
	</div>
{/if}
