<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { ConversationSummaryData } from '../conversation-summary-tabs.types';
	import { CircularProgressBar, MistakeSeverityIndicator } from '$lib/components/scores';
	import { User, Bot } from 'lucide-svelte';
	import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import type { ApexOptions } from 'apexcharts';

	interface Props {
		data: ConversationSummaryData;
	}

	let { data }: Props = $props();

	function formatScore(score: number | null): string {
		if (score === null) return 'N/A';

		return score.toFixed(1);
	}
</script>

{#snippet messageCard(
	icon: typeof User | typeof Bot,
	label: string,
	messageCount: number,
	averageCharacters: number | null
)}
	{@const IconComponent = icon}
	<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
		<div class="flex items-center gap-3 mb-3">
			<div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
				<IconComponent class="w-5 h-5 text-gray-700 dark:text-gray-300" />
			</div>
			<div class="flex-1">
				<div class="text-sm text-gray-600 dark:text-gray-400">{label}</div>
				<div class="text-xl font-bold dark:text-gray-100">{messageCount}</div>
			</div>
		</div>
		<div class="text-xs text-gray-500 dark:text-gray-400">
			Avg. {averageCharacters !== null ? `${averageCharacters} chars` : 'N/A'} per message
		</div>
	</div>
{/snippet}

{#snippet statCard(label: string, value: number | string)}
	<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
		<div class="text-sm text-gray-600 dark:text-gray-400">{label}</div>
		<div class="text-2xl font-bold dark:text-gray-100">{value}</div>
	</div>
{/snippet}

{#snippet mistakeSeverityCard(
	severity: ConversationMessageMistakeSeverity,
	count: number,
	colorClasses: {
		bg: string;
		border: string;
		text: string;
		valueText: string;
	}
)}
	<div class={cn(colorClasses.bg, colorClasses.border, 'p-4 rounded-lg border')}>
		<div class="flex flex-col items-center gap-3">
			<MistakeSeverityIndicator {severity} showLabel={false} class="self-end" />
			<div class="text-center">
				<div class={cn(colorClasses.valueText, 'text-2xl font-bold')}>{count}</div>
				<div class={cn(colorClasses.text, 'text-xs mb-1')}>{severity}</div>
			</div>
		</div>
	</div>
{/snippet}

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
	{#snippet children()}
		<!-- Basic Statistics -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold dark:text-gray-200">Overview</h3>
			<div class="grid grid-cols-2 gap-4">
				{@render messageCard(
					User,
					'User Messages',
					data.userMessages.length,
					data.averageUserMessageCharacters
				)}
				{@render messageCard(
					Bot,
					'AI Messages',
					data.aiMessages.length,
					data.averageAiMessageCharacters
				)}
			</div>
		</div>

		<!-- Average Scores -->
		{#if !isEmpty(data.feedbacks)}
			<div class="space-y-4">
				<h3 class="text-lg font-semibold dark:text-gray-200">Average Scores</h3>
				<div class="grid grid-cols-3 gap-4">
					<CircularProgressBar label="Grammar" score={data.averageGrammar} />
					<CircularProgressBar label="Vocabulary" score={data.averageVocabulary} />
					<CircularProgressBar label="Naturalness" score={data.averageNaturalness} />
				</div>
			</div>
		{/if}

		<!-- Mistake Severity Summary -->
		{#if !isEmpty(data.feedbacks) && data.totalMistakes > 0}
			{@const pieChartOptions: ApexOptions = {
				chart: {
					type: 'pie',
					height: 300,
					toolbar: {
						show: false
					}
				},
				series: [
					data.mistakesBySeverity.severity1,
					data.mistakesBySeverity.severity2,
					data.mistakesBySeverity.severity3
				],
				labels: ['Minor (1)', 'Moderate (2)', 'Critical (3)'],
				colors: ['#dc2626', '#f97316', '#b91c1c'], // red-600, orange-500, red-700
				legend: {
					position: 'bottom',
					labels: {
						colors: undefined // Use default colors that adapt to theme
					}
				},
				responsive: [
					{
						breakpoint: 480,
						options: {
							chart: {
								height: 250
							},
							legend: {
								position: 'bottom'
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
				<h3 class="text-lg font-semibold dark:text-gray-200">Mistake Severity</h3>
				<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
					<Chart options={pieChartOptions} />
				</div>
			</div>
		{/if}

		<!-- Empty State -->
		{#if isEmpty(data.feedbacks) && data.totalLearningTips === 0}
			<div class="text-center py-8 text-gray-500 dark:text-gray-400">
				<p>No data available yet.</p>
				<p class="text-sm mt-2">Send messages to receive feedback and see statistics here.</p>
			</div>
		{/if}
	{/snippet}
</ScrollableWrapper>
