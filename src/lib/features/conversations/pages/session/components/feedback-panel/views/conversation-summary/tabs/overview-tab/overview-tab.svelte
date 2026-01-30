<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { ConversationSummaryData } from '../conversation-summary-tabs.types';

	interface Props {
		data: ConversationSummaryData;
	}

	let { data }: Props = $props();

	function formatScore(score: number | null): string {
		if (score === null) return 'N/A';

		return score.toFixed(1);
	}
</script>

{#snippet statCard(label: string, value: number | string)}
	<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
		<div class="text-sm text-gray-600 dark:text-gray-400">{label}</div>
		<div class="text-2xl font-bold dark:text-gray-100">{value}</div>
	</div>
{/snippet}

{#snippet scoreCard(label: string, score: number | null)}
	<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
		<div class="flex justify-between items-center">
			<span class="text-sm font-medium dark:text-gray-300">{label}</span>
			<span class="text-lg font-bold dark:text-gray-100">
				{formatScore(score)} / 10
			</span>
		</div>
	</div>
{/snippet}

{#snippet feedbackSummaryCard(
	label: string,
	value: number,
	colorClasses: {
		bg: string;
		border: string;
		text: string;
		valueText: string;
	}
)}
	<div class={cn(colorClasses.bg, colorClasses.border, 'p-4 rounded-lg border')}>
		<div class={colorClasses.text}>{label}</div>
		<div class={cn(colorClasses.valueText, 'text-2xl font-bold')}>{value}</div>
	</div>
{/snippet}

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
	{#snippet children()}
		<!-- Basic Statistics -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold dark:text-gray-200">Overview</h3>
			<div class="grid grid-cols-2 gap-4">
				{@render statCard('Total Messages', data.totalMessages)}
				{@render statCard('User Messages', data.userMessages.length)}
				{@render statCard('AI Messages', data.aiMessages.length)}
				{@render statCard('Messages with Feedback', data.messagesWithFeedback.length)}
			</div>
		</div>

		<!-- Average Scores -->
		{#if !isEmpty(data.feedbacks)}
			<div class="space-y-4">
				<h3 class="text-lg font-semibold dark:text-gray-200">Average Scores</h3>
				<div class="space-y-3">
					{@render scoreCard('Grammar', data.averageGrammar)}
					{@render scoreCard('Vocabulary', data.averageVocabulary)}
					{@render scoreCard('Naturalness', data.averageNaturalness)}
				</div>
			</div>
		{/if}

		<!-- Feedback Items Summary -->
		{#if !isEmpty(data.feedbacks)}
			<div class="space-y-4">
				<h3 class="text-lg font-semibold dark:text-gray-200">Feedback Summary</h3>
				<div class="grid grid-cols-3 gap-4">
					{@render feedbackSummaryCard('Mistakes', data.totalMistakes, {
						bg: 'bg-red-50 dark:bg-red-900/20',
						border: 'border-red-200 dark:border-red-800',
						text: 'text-sm text-red-700 dark:text-red-300',
						valueText: 'text-red-900 dark:text-red-100'
					})}
					{@render feedbackSummaryCard('Strengths', data.totalStrengths, {
						bg: 'bg-green-50 dark:bg-green-900/20',
						border: 'border-green-200 dark:border-green-800',
						text: 'text-sm text-green-700 dark:text-green-300',
						valueText: 'text-green-900 dark:text-green-100'
					})}
					{@render feedbackSummaryCard('Suggestions', data.totalSuggestions, {
						bg: 'bg-purple-50 dark:bg-purple-900/20',
						border: 'border-purple-200 dark:border-purple-800',
						text: 'text-sm text-purple-700 dark:text-purple-300',
						valueText: 'text-purple-900 dark:text-purple-100'
					})}
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
