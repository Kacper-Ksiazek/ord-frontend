<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { ConversationSummaryData } from '../conversation-summary-tabs.types';
	import { CircularProgressBar } from '$lib/components/scores';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import type { ApexOptions } from 'apexcharts';
	import { MISTAKE_SEVERITY_CHART_COLORS } from '$lib/features/conversations/pages/session/consts/mistake-severity-colors';
	import { FEEDBACK_CHART_COLORS } from '$lib/features/conversations/pages/session/consts/feedback-chart-colors';
	import { LEARNING_TIPS_CHART_COLORS } from '$lib/features/conversations/pages/session/consts/learning-tips-chart-colors';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/icons';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$lib/features/conversations/pages/session/consts/user-message-feedback/icons';
	import type { Snippet } from 'svelte';
	import AuthUserAvatar from '$lib/components/auth-user-avatar.svelte';
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$lib/types/conversation/domain/conversation';
	import { getScoreBoxColor } from '$lib/features/conversations/pages/session/consts/score-colors';
	import { cn, Tooltip } from 'flowbite-svelte';
	import { ChevronRight, HelpCircle } from 'lucide-svelte';

	interface Props {
		data: ConversationSummaryData;
	}

	let { data }: Props = $props();

	const conversation = getConversationContext();
	const { interlocutor } = conversation;

	const GrammarIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP.GRAMMAR;
	const VocabularyIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP.VOCABULARY;
	const PhrasesIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP.PHRASES;
	const MistakesIcon = USER_MESSAGE_FEEDBACK_ICONS_MAP.MISTAKES;
	const StrengthsIcon = USER_MESSAGE_FEEDBACK_ICONS_MAP.STRENGTHS;
	const SuggestionsIcon = USER_MESSAGE_FEEDBACK_ICONS_MAP.SUGGESTIONS;
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
		<!-- Message Statistics -->
		<div class="space-y-4">
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

		<!-- User Messages with Ratings Table -->
		{#if !isEmpty(data.messagesWithFeedback)}
			<div class="space-y-4">
				<h3 class="text-lg font-semibold dark:text-gray-200">User Messages & Ratings</h3>
				<div class="overflow-x-auto">
					<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" class="px-4 py-3">#</th>
								<th scope="col" class="px-4 py-3">Message</th>
								<th scope="col" id="grammar-header" class="px-4 py-3 text-center align-middle">
									<div class="flex items-center justify-center gap-1.5">
										<span class="leading-none">G</span>
										<HelpCircle class="w-3 h-3 text-gray-600 dark:text-gray-400 shrink-0" />
									</div>
								</th>
								<th scope="col" id="vocabulary-header" class="px-4 py-3 text-center align-middle">
									<div class="flex items-center justify-center gap-1.5">
										<span class="leading-none">V</span>
										<HelpCircle class="w-3 h-3 text-gray-600 dark:text-gray-400 shrink-0" />
									</div>
								</th>
								<th scope="col" id="naturalness-header" class="px-4 py-3 text-center align-middle">
									<div class="flex items-center justify-center gap-1.5">
										<span class="leading-none">N</span>
										<HelpCircle class="w-3 h-3 text-gray-600 dark:text-gray-400 shrink-0" />
									</div>
								</th>
								<th scope="col" class="px-4 py-3"></th>
							</tr>
						</thead>
						<tbody>
							{#each data.messagesWithFeedback as message, index}
								{@const trimmedMessage =
									message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content}
								{@const feedback = message.feedback}
								{@const grammarScore = feedback?.grammar ?? null}
								{@const vocabularyScore = feedback?.vocabulary ?? null}
								{@const naturalnessScore = feedback?.naturalness ?? null}
								{@const grammarBoxColor = grammarScore !== null ? getScoreBoxColor(grammarScore) : ''}
								{@const vocabularyBoxColor =
									vocabularyScore !== null ? getScoreBoxColor(vocabularyScore) : ''}
								{@const naturalnessBoxColor =
									naturalnessScore !== null ? getScoreBoxColor(naturalnessScore) : ''}
								<tr class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
									<td class="px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">{index + 1}</td>
									<td class="px-4 py-3 text-xs text-gray-900 dark:text-gray-100">{trimmedMessage}</td>
									<td class="px-4 py-3">
										{#if grammarScore !== null}
											<div class={cn('w-8 h-8 rounded-sm flex items-center justify-center', grammarBoxColor)}>
												<span class="text-sm font-bold text-white dark:text-white">
													{grammarScore}
												</span>
											</div>
										{:else}
											<span class="text-gray-400 dark:text-gray-500">-</span>
										{/if}
									</td>
									<td class="px-4 py-3">
										{#if vocabularyScore !== null}
											<div
												class={cn('w-8 h-8 rounded-sm flex items-center justify-center', vocabularyBoxColor)}
											>
												<span class="text-sm font-bold text-white dark:text-white">
													{vocabularyScore}
												</span>
											</div>
										{:else}
											<span class="text-gray-400 dark:text-gray-500">-</span>
										{/if}
									</td>
									<td class="px-4 py-3">
										{#if naturalnessScore !== null}
											<div
												class={cn('w-8 h-8 rounded-sm flex items-center justify-center', naturalnessBoxColor)}
											>
												<span class="text-sm font-bold text-white dark:text-white">
													{naturalnessScore}
												</span>
											</div>
										{:else}
											<span class="text-gray-400 dark:text-gray-500">-</span>
										{/if}
									</td>
									<td class="px-4 py-3">
										<button
											type="button"
											onclick={() => alert(`Message ${index + 1}`)}
											class={cn(
												'flex items-center justify-center p-1.5 rounded-md transition-colors cursor-pointer',
												'hover:bg-gray-100 dark:hover:bg-gray-700',
												'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
											)}
											aria-label="Show message details"
										>
											<ChevronRight class="w-4 h-4 text-gray-700 dark:text-gray-300" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<Tooltip triggeredBy="#grammar-header">Grammar</Tooltip>
					<Tooltip triggeredBy="#vocabulary-header">Vocabulary</Tooltip>
					<Tooltip triggeredBy="#naturalness-header">Naturalness</Tooltip>
				</div>
				<!-- Legend -->
				<div class="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
					<span class="font-medium dark:text-gray-300">Categories:</span>
					<span>G = Grammar</span>
					<span>V = Vocabulary</span>
					<span>N = Naturalness</span>
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
