<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { ConversationSummaryData } from '../conversation-summary-tabs.types';
	import { CircularProgressBar } from '$lib/components/scores';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import type { ApexOptions } from 'apexcharts';
	import { MISTAKE_SEVERITY_CHART_COLORS } from '$lib/features/conversations/pages/session/consts/mistake-severity-colors';
	import { getScoreBoxColor } from '$lib/features/conversations/pages/session/consts/score-colors';
	import { cn, Tooltip } from 'flowbite-svelte';
	import { ChevronRight, CircleHelp } from 'lucide-svelte';
	import { MessageStatistics } from './sections';

	interface Props {
		data: ConversationSummaryData;
	}

	let { data }: Props = $props();
</script>

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
	<MessageStatistics userMessages={data.userMessages} aiMessages={data.aiMessages} />

	<!-- Performance Scores -->

	<!-- Mistake Severity Summary -->
	{#if !isEmpty(data.feedbacks) && data.totalMistakes > 0}
		{@const severity1 = data.mistakesBySeverity.severity1}
		{@const severity2 = data.mistakesBySeverity.severity2}
		{@const severity3 = data.mistakesBySeverity.severity3}
		{@const total = data.totalMistakes}
		{@const severity1Percentage = total > 0 ? ((severity1 / total) * 100).toFixed(1) : '0.0'}
		{@const severity2Percentage = total > 0 ? ((severity2 / total) * 100).toFixed(1) : '0.0'}
		{@const severity3Percentage = total > 0 ? ((severity3 / total) * 100).toFixed(1) : '0.0'}
		{@const pieChartOptions: ApexOptions = {
				chart: {
					type: 'pie',
					height: 300,
					toolbar: {
						show: false
					}
				},
				series: [severity1, severity2, severity3],
				labels: ['Minor (1)', 'Moderate (2)', 'Critical (3)'],
				colors: MISTAKE_SEVERITY_CHART_COLORS,
				dataLabels: {
					enabled: true,
					formatter: (val: number) => {
						// Show only percentage for minimal labels
						return `${val.toFixed(1)}%`;
					},
					style: {
						fontSize: '11px',
						fontWeight: 600,
						colors: ['#fff']
					},
					dropShadow: {
						enabled: true,
						opacity: 0.5,
						blur: 3
					}
				},
				legend: {
					show: false // Hide default legend, we'll use custom one
				},
				responsive: [
					{
						breakpoint: 768,
						options: {
							chart: {
								height: 250
							},
							dataLabels: {
								style: {
									fontSize: '10px'
								}
							}
						}
					}
				],
				tooltip: {
					y: {
						formatter: (value) => `${value} mistake${value !== 1 ? 's' : ''}`
					}
				}
			}}
		<div class="space-y-4">
			<h3 class="heading-5">Mistake Severity</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Pie Chart -->
				<div class="p-4 rounded-lg">
					<Chart options={pieChartOptions} />
				</div>
				<!-- Detailed Legend -->
				<div class="p-4 rounded-lg flex flex-col justify-center">
					<div class="space-y-3">
						<!-- Minor -->
						<div class="flex items-center gap-3">
							<div
								class="w-4 h-4 rounded-full shrink-0"
								style="background-color: {MISTAKE_SEVERITY_CHART_COLORS[0]}"
							></div>
							<div class="flex-1">
								<div class="label">Minor (1)</div>
								<div class="caption">
									{severity1} mistake{severity1 !== 1 ? 's' : ''} • {severity1Percentage}%
								</div>
							</div>
						</div>
						<!-- Moderate -->
						<div class="flex items-center gap-3">
							<div
								class="w-4 h-4 rounded-full shrink-0"
								style="background-color: {MISTAKE_SEVERITY_CHART_COLORS[1]}"
							></div>
							<div class="flex-1">
								<div class="label">Moderate (2)</div>
								<div class="caption">
									{severity2} mistake{severity2 !== 1 ? 's' : ''} • {severity2Percentage}%
								</div>
							</div>
						</div>
						<!-- Critical -->
						<div class="flex items-center gap-3">
							<div
								class="w-4 h-4 rounded-full shrink-0"
								style="background-color: {MISTAKE_SEVERITY_CHART_COLORS[2]}"
							></div>
							<div class="flex-1">
								<div class="label">Critical (3)</div>
								<div class="caption">
									{severity3} mistake{severity3 !== 1 ? 's' : ''} • {severity3Percentage}%
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Empty State -->
	{#if isEmpty(data.feedbacks) && data.totalLearningTips === 0}
		<div class="text-center py-8 text-muted">
			<p>No data available yet.</p>
			<p class="text-muted-small mt-2">Send messages to receive feedback and see statistics here.</p>
		</div>
	{/if}
</ScrollableWrapper>
