<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { ConversationSummaryData } from '../conversation-summary-tabs.types';
	import { CircularProgressBar, MistakeSeverityIndicator } from '$lib/components/scores';
	import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import type { ApexOptions } from 'apexcharts';
	import { MISTAKE_SEVERITY_CHART_COLORS } from '$lib/features/conversations/pages/session/consts/mistake-severity-colors';
	import { LEARNING_TIPS_CHART_COLORS } from '$lib/features/conversations/pages/session/consts/learning-tips-chart-colors';
	import { FEEDBACK_CHART_COLORS } from '$lib/features/conversations/pages/session/consts/feedback-chart-colors';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/icons';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$lib/features/conversations/pages/session/consts/user-message-feedback/icons';
	import type { Snippet } from 'svelte';
	import AuthUserAvatar from '$lib/components/auth-user-avatar.svelte';
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$lib/types/conversation/domain/conversation';
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';
	import ConversationToneIcon from '$lib/features/conversations/shared/components/conversation-tone-icon.svelte';
	import {
		getConversationTypeLabel,
		getConversationToneLabel
	} from '$lib/features/conversations/shared/utils';

	interface Props {
		data: ConversationSummaryData;
	}

	let { data }: Props = $props();

	const conversation = getConversationContext();
	const { interlocutor, type, aiTone, topic } = conversation;

	// Icon components for legends
	const GrammarIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP.GRAMMAR;
	const VocabularyIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP.VOCABULARY;
	const PhrasesIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP.PHRASES;
	const MistakesIcon = USER_MESSAGE_FEEDBACK_ICONS_MAP.MISTAKES;
	const StrengthsIcon = USER_MESSAGE_FEEDBACK_ICONS_MAP.STRENGTHS;
	const SuggestionsIcon = USER_MESSAGE_FEEDBACK_ICONS_MAP.SUGGESTIONS;

	function formatScore(score: number | null): string {
		if (score === null) return 'N/A';

		return score.toFixed(1);
	}
</script>

{#snippet messageCard(
	avatar: Snippet,
	label: string,
	messageCount: number,
	averageCharacters: number | null,
	feedbackCounts?: { mistakes: number; strengths: number; suggestions: number },
	learningTipCounts?: { grammar: number; vocabulary: number; phrases: number }
)}
	<div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center gap-3 mb-3">
			<div class="shrink-0">
				{@render avatar()}
			</div>
			<div class="flex-1">
				<div class="text-sm text-gray-600 dark:text-gray-400">{label}</div>
				<div class="text-xl font-bold dark:text-gray-100">{messageCount}</div>
			</div>
		</div>
		<div class="text-sm text-gray-700 dark:text-gray-300 mb-3">
			Avg. {averageCharacters !== null ? `${averageCharacters} chars` : 'N/A'} per message
		</div>
		<!-- Feedback Categories (for User Messages) -->
		{#if feedbackCounts}
			<div class="pt-3 border-t border-gray-200 dark:border-gray-600">
				<div class="flex gap-2">
					{#if feedbackCounts.mistakes > 0}
						<div
							class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
						>
							<MistakesIcon class="w-5 h-5" style="color: {FEEDBACK_CHART_COLORS.MISTAKES}" />
							<span class="text-base font-semibold text-gray-700 dark:text-gray-300"
								>{feedbackCounts.mistakes}</span
							>
						</div>
					{/if}
					{#if feedbackCounts.strengths > 0}
						<div
							class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
						>
							<StrengthsIcon class="w-5 h-5" style="color: {FEEDBACK_CHART_COLORS.STRENGTHS}" />
							<span class="text-base font-semibold text-gray-700 dark:text-gray-300"
								>{feedbackCounts.strengths}</span
							>
						</div>
					{/if}
					{#if feedbackCounts.suggestions > 0}
						<div
							class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800"
						>
							<SuggestionsIcon class="w-5 h-5" style="color: {FEEDBACK_CHART_COLORS.SUGGESTIONS}" />
							<span class="text-base font-semibold text-gray-700 dark:text-gray-300"
								>{feedbackCounts.suggestions}</span
							>
						</div>
					{/if}
				</div>
			</div>
		{/if}
		<!-- Learning Tips Categories (for AI Messages) -->
		{#if learningTipCounts}
			<div class="pt-3 border-t border-gray-200 dark:border-gray-600">
				<div class="flex gap-2">
					{#if learningTipCounts.grammar > 0}
						<div
							class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
						>
							<GrammarIcon class="w-5 h-5" style="color: {LEARNING_TIPS_CHART_COLORS.GRAMMAR}" />
							<span class="text-base font-semibold text-gray-700 dark:text-gray-300"
								>{learningTipCounts.grammar}</span
							>
						</div>
					{/if}
					{#if learningTipCounts.vocabulary > 0}
						<div
							class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800"
						>
							<VocabularyIcon class="w-5 h-5" style="color: {LEARNING_TIPS_CHART_COLORS.VOCABULARY}" />
							<span class="text-base font-semibold text-gray-700 dark:text-gray-300"
								>{learningTipCounts.vocabulary}</span
							>
						</div>
					{/if}
					{#if learningTipCounts.phrases > 0}
						<div
							class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800"
						>
							<PhrasesIcon class="w-5 h-5" style="color: {LEARNING_TIPS_CHART_COLORS.PHRASES}" />
							<span class="text-base font-semibold text-gray-700 dark:text-gray-300"
								>{learningTipCounts.phrases}</span
							>
						</div>
					{/if}
				</div>
			</div>
		{/if}
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

{#snippet userAvatar()}
	<AuthUserAvatar size={40} class="rounded-full" />
{/snippet}

{#snippet aiAvatar()}
	<AiInterlocutorAvatar
		avatarId={interlocutor.avatarId as ConversationAIInterlocutorAvatarId}
		size="fullsize"
		class="rounded-full w-10 h-10"
	/>
{/snippet}

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
	{#snippet children()}
		<!-- Overview -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold dark:text-gray-200">Overview</h3>

			<!-- Conversation Metadata -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<!-- Type -->
				<div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<ConversationTypeIcon
							conversationType={type}
							class="w-8 h-8 text-gray-600 dark:text-gray-400"
						/>
						<div>
							<div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</div>
							<div class="text-base font-semibold dark:text-gray-200">
								{getConversationTypeLabel(type)}
							</div>
						</div>
					</div>
				</div>
				<!-- AI Tone -->
				<div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<ConversationToneIcon tone={aiTone} class="w-8 h-8 text-gray-600 dark:text-gray-400" />
						<div>
							<div class="text-sm text-gray-600 dark:text-gray-400 mb-1">AI Tone</div>
							<div class="text-base font-semibold dark:text-gray-200">
								{getConversationToneLabel(aiTone)}
							</div>
						</div>
					</div>
				</div>
				<!-- Topic -->
				<div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
								/>
							</svg>
						</div>
						<div>
							<div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Topic</div>
							<div class="text-base font-semibold dark:text-gray-200">{topic}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Basic Statistics -->
			<h3 class="text-lg font-semibold dark:text-gray-200">Message Statistics</h3>
			<div class="grid grid-cols-2 gap-4">
				{@render messageCard(
					userAvatar,
					'User Messages',
					data.userMessages.length,
					data.averageUserMessageCharacters,
					!isEmpty(data.feedbacks)
						? {
								mistakes: data.totalMistakes,
								strengths: data.totalStrengths,
								suggestions: data.totalSuggestions
							}
						: undefined
				)}
				{@render messageCard(
					aiAvatar,
					'AI Messages',
					data.aiMessages.length,
					data.averageAiMessageCharacters,
					undefined,
					data.totalLearningTips > 0
						? {
								grammar: data.learningTipsByCategory.grammar,
								vocabulary: data.learningTipsByCategory.vocabulary,
								phrases: data.learningTipsByCategory.phrases
							}
						: undefined
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
				<h3 class="text-lg font-semibold dark:text-gray-200">Mistake Severity</h3>
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
									<div class="text-sm font-medium dark:text-gray-200">Minor (1)</div>
									<div class="text-xs text-gray-600 dark:text-gray-400">
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
									<div class="text-sm font-medium dark:text-gray-200">Moderate (2)</div>
									<div class="text-xs text-gray-600 dark:text-gray-400">
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
									<div class="text-sm font-medium dark:text-gray-200">Critical (3)</div>
									<div class="text-xs text-gray-600 dark:text-gray-400">
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
			<div class="text-center py-8 text-gray-500 dark:text-gray-400">
				<p>No data available yet.</p>
				<p class="text-sm mt-2">Send messages to receive feedback and see statistics here.</p>
			</div>
		{/if}
	{/snippet}
</ScrollableWrapper>
