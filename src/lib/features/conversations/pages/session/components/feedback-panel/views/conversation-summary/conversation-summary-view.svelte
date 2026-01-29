<script lang="ts">
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { Tabs } from '$lib/components/tabs';
	import type { Tab } from '$lib/components/tabs';
	import type {
		ConversationMessageMistakeSeverity,
		ConversationMessageSuggestionType,
		ConversationMessageMistake,
		ConversationMessageStrength,
		ConversationMessageSuggestion
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import type {
		AIMessageGrammarTip,
		AIMessageVocabularyTip,
		AIMessagePhraseTip
	} from '$lib/types/ongoing-conversation/api/responses';
	import {
		GrammarTipCard,
		VocabularyTipCard,
		PhraseTipCard
	} from '../../../shared/ai-message-learning-tips/cards';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '../../../shared/user-message-feedback/cards';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';

	const messagesContext = getMessagesContext();

	const messages = $derived(messagesContext.messages);

	// Basic counts
	const totalMessages = $derived(messages.length);
	const userMessages = $derived(messages.filter((msg) => msg.sender === 'USER'));
	const aiMessages = $derived(messages.filter((msg) => msg.sender === 'AI'));
	const messagesWithFeedback = $derived(userMessages.filter((msg) => msg.feedback !== null));

	// Score statistics
	const feedbacks = $derived.by(() => {
		return userMessages
			.map((msg) => msg.feedback)
			.filter((f): f is NonNullable<typeof f> => f !== null);
	});

	const averageGrammar = $derived.by(() => {
		if (feedbacks.length === 0) return null;
		const sum = feedbacks.reduce((acc, f) => acc + (f.grammar ?? 0), 0);
		return sum / feedbacks.length;
	});

	const averageVocabulary = $derived.by(() => {
		if (feedbacks.length === 0) return null;
		const sum = feedbacks.reduce((acc, f) => acc + (f.vocabulary ?? 0), 0);
		return sum / feedbacks.length;
	});

	const averageNaturalness = $derived.by(() => {
		if (feedbacks.length === 0) return null;
		const sum = feedbacks.reduce((acc, f) => acc + (f.naturalness ?? 0), 0);
		return sum / feedbacks.length;
	});

	// Feedback items statistics
	const totalMistakes = $derived.by(() => {
		return feedbacks.reduce((acc, f) => acc + (f.mistakes?.length ?? 0), 0);
	});

	const totalStrengths = $derived.by(() => {
		return feedbacks.reduce((acc, f) => acc + (f.strengths?.length ?? 0), 0);
	});

	const totalSuggestions = $derived.by(() => {
		return feedbacks.reduce((acc, f) => acc + (f.suggestions?.length ?? 0), 0);
	});

	// Aggregate all learning tips
	const allGrammarTips = $derived.by(() => {
		const tips: AIMessageGrammarTip[] = [];
		aiMessages.forEach((msg) => {
			if (msg.learningTips?.grammarTips) {
				tips.push(...msg.learningTips.grammarTips);
			}
		});
		return tips;
	});

	const allVocabularyTips = $derived.by(() => {
		const tips: AIMessageVocabularyTip[] = [];
		aiMessages.forEach((msg) => {
			if (msg.learningTips?.vocabularyTips) {
				tips.push(...msg.learningTips.vocabularyTips);
			}
		});
		return tips;
	});

	const allPhraseTips = $derived.by(() => {
		const tips: AIMessagePhraseTip[] = [];
		aiMessages.forEach((msg) => {
			if (msg.learningTips?.phraseTips) {
				tips.push(...msg.learningTips.phraseTips);
			}
		});
		return tips;
	});

	const totalLearningTips = $derived(
		allGrammarTips.length + allVocabularyTips.length + allPhraseTips.length
	);

	// Aggregate all feedback items
	const allMistakes = $derived.by(() => {
		const mistakes: ConversationMessageMistake[] = [];
		feedbacks.forEach((f) => {
			if (f.mistakes) {
				mistakes.push(...f.mistakes);
			}
		});
		return mistakes;
	});

	const allStrengths = $derived.by(() => {
		const strengths: ConversationMessageStrength[] = [];
		feedbacks.forEach((f) => {
			if (f.strengths) {
				strengths.push(...f.strengths);
			}
		});
		return strengths;
	});

	const allSuggestions = $derived.by(() => {
		const suggestions: ConversationMessageSuggestion[] = [];
		feedbacks.forEach((f) => {
			if (f.suggestions) {
				suggestions.push(...f.suggestions);
			}
		});
		return suggestions;
	});

	// Main tabs
	let activeMainTab = $state<'overview' | 'learning-tips' | 'feedback'>('overview');

	const mainTabs = $derived.by(() => {
		const tabs: Tab[] = [{ id: 'overview', label: 'Overview', count: totalMessages }];

		if (totalLearningTips > 0) {
			tabs.push({
				id: 'learning-tips',
				label: 'Learning Tips',
				count: totalLearningTips,
				disabled: false
			});
		}

		if (feedbacks.length > 0) {
			tabs.push({
				id: 'feedback',
				label: 'Feedback',
				count: totalMistakes + totalStrengths + totalSuggestions,
				disabled: false
			});
		}

		return tabs;
	});

	// Learning tips subtype tabs
	let activeLearningTipTab = $state<LearningTipCategory | 'all'>('all');

	const learningTipTabs = $derived.by(() => {
		const tabs: Tab[] = [
			{
				id: 'all',
				label: 'All',
				count: totalLearningTips,
				disabled: false
			}
		];

		if (allGrammarTips.length > 0) {
			tabs.push({
				id: 'GRAMMAR',
				label: 'Grammar',
				count: allGrammarTips.length,
				disabled: false
			});
		}

		if (allVocabularyTips.length > 0) {
			tabs.push({
				id: 'VOCABULARY',
				label: 'Vocabulary',
				count: allVocabularyTips.length,
				disabled: false
			});
		}

		if (allPhraseTips.length > 0) {
			tabs.push({
				id: 'PHRASES',
				label: 'Phrases',
				count: allPhraseTips.length,
				disabled: false
			});
		}

		return tabs;
	});

	const filteredLearningTips = $derived.by(() => {
		if (activeLearningTipTab === 'all') {
			return {
				grammar: allGrammarTips,
				vocabulary: allVocabularyTips,
				phrases: allPhraseTips
			};
		}

		if (activeLearningTipTab === 'GRAMMAR') {
			return { grammar: allGrammarTips, vocabulary: [], phrases: [] };
		}
		if (activeLearningTipTab === 'VOCABULARY') {
			return { grammar: [], vocabulary: allVocabularyTips, phrases: [] };
		}
		if (activeLearningTipTab === 'PHRASES') {
			return { grammar: [], vocabulary: [], phrases: allPhraseTips };
		}

		return { grammar: [], vocabulary: [], phrases: [] };
	});

	// Feedback subtype tabs
	let activeFeedbackTab = $state<'MISTAKES' | 'STRENGTHS' | 'SUGGESTIONS' | 'all'>('all');

	const feedbackTabs = $derived.by(() => {
		const tabs: Tab[] = [
			{
				id: 'all',
				label: 'All',
				count: totalMistakes + totalStrengths + totalSuggestions,
				disabled: false
			}
		];

		if (totalMistakes > 0) {
			tabs.push({
				id: 'MISTAKES',
				label: 'Mistakes',
				count: totalMistakes,
				disabled: false
			});
		}

		if (totalStrengths > 0) {
			tabs.push({
				id: 'STRENGTHS',
				label: 'Strengths',
				count: totalStrengths,
				disabled: false
			});
		}

		if (totalSuggestions > 0) {
			tabs.push({
				id: 'SUGGESTIONS',
				label: 'Suggestions',
				count: totalSuggestions,
				disabled: false
			});
		}

		return tabs;
	});

	const filteredFeedback = $derived.by(() => {
		if (activeFeedbackTab === 'all') {
			return {
				mistakes: allMistakes,
				strengths: allStrengths,
				suggestions: allSuggestions
			};
		}

		if (activeFeedbackTab === 'MISTAKES') {
			return { mistakes: allMistakes, strengths: [], suggestions: [] };
		}
		if (activeFeedbackTab === 'STRENGTHS') {
			return { mistakes: [], strengths: allStrengths, suggestions: [] };
		}
		if (activeFeedbackTab === 'SUGGESTIONS') {
			return { mistakes: [], strengths: [], suggestions: allSuggestions };
		}

		return { mistakes: [], strengths: [], suggestions: [] };
	});

	function formatScore(score: number | null): string {
		if (score === null) return 'N/A';
		return score.toFixed(1);
	}
</script>

<div class="flex flex-col h-full min-h-0">
	<div class="flex-shrink-0 space-y-6">
		<h2 class="text-xl font-bold mb-4 dark:text-gray-100">Conversation Summary</h2>

		<!-- Main Tabs -->
		<Tabs tabs={mainTabs} bind:activeTab={activeMainTab} activeColor="primary" class="mb-6" />
	</div>

	<!-- Content Area -->
	<div class="flex-1 min-h-0 flex flex-col">
		<!-- Overview Tab -->
		{#if activeMainTab === 'overview'}
			<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
				{#snippet children()}
					<!-- Basic Statistics -->
					<div class="space-y-4">
						<h3 class="text-lg font-semibold dark:text-gray-200">Overview</h3>
						<div class="grid grid-cols-2 gap-4">
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div class="text-sm text-gray-600 dark:text-gray-400">Total Messages</div>
								<div class="text-2xl font-bold dark:text-gray-100">{totalMessages}</div>
							</div>
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div class="text-sm text-gray-600 dark:text-gray-400">User Messages</div>
								<div class="text-2xl font-bold dark:text-gray-100">{userMessages.length}</div>
							</div>
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div class="text-sm text-gray-600 dark:text-gray-400">AI Messages</div>
								<div class="text-2xl font-bold dark:text-gray-100">{aiMessages.length}</div>
							</div>
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div class="text-sm text-gray-600 dark:text-gray-400">Messages with Feedback</div>
								<div class="text-2xl font-bold dark:text-gray-100">
									{messagesWithFeedback.length}
								</div>
							</div>
						</div>
					</div>

					<!-- Average Scores -->
					{#if feedbacks.length > 0}
						<div class="space-y-4">
							<h3 class="text-lg font-semibold dark:text-gray-200">Average Scores</h3>
							<div class="space-y-3">
								<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
									<div class="flex justify-between items-center">
										<span class="text-sm font-medium dark:text-gray-300">Grammar</span>
										<span class="text-lg font-bold dark:text-gray-100">
											{formatScore(averageGrammar)} / 10
										</span>
									</div>
								</div>
								<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
									<div class="flex justify-between items-center">
										<span class="text-sm font-medium dark:text-gray-300">Vocabulary</span>
										<span class="text-lg font-bold dark:text-gray-100">
											{formatScore(averageVocabulary)} / 10
										</span>
									</div>
								</div>
								<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
									<div class="flex justify-between items-center">
										<span class="text-sm font-medium dark:text-gray-300">Naturalness</span>
										<span class="text-lg font-bold dark:text-gray-100">
											{formatScore(averageNaturalness)} / 10
										</span>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Feedback Items Summary -->
					{#if feedbacks.length > 0}
						<div class="space-y-4">
							<h3 class="text-lg font-semibold dark:text-gray-200">Feedback Summary</h3>
							<div class="grid grid-cols-3 gap-4">
								<div
									class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
								>
									<div class="text-sm text-red-700 dark:text-red-300">Mistakes</div>
									<div class="text-2xl font-bold text-red-900 dark:text-red-100">
										{totalMistakes}
									</div>
								</div>
								<div
									class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
								>
									<div class="text-sm text-green-700 dark:text-green-300">Strengths</div>
									<div class="text-2xl font-bold text-green-900 dark:text-green-100">
										{totalStrengths}
									</div>
								</div>
								<div
									class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
								>
									<div class="text-sm text-purple-700 dark:text-purple-300">Suggestions</div>
									<div class="text-2xl font-bold text-purple-900 dark:text-purple-100">
										{totalSuggestions}
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Empty State -->
					{#if feedbacks.length === 0 && totalLearningTips === 0}
						<div class="text-center py-8 text-gray-500 dark:text-gray-400">
							<p>No data available yet.</p>
							<p class="text-sm mt-2">Send messages to receive feedback and see statistics here.</p>
						</div>
					{/if}
				{/snippet}
			</ScrollableWrapper>
		{/if}

		<!-- Learning Tips Tab -->
		{#if activeMainTab === 'learning-tips'}
			{#if totalLearningTips > 0}
				<div class="flex-shrink-0 mb-4">
					<!-- Subtype Tabs -->
					<Tabs tabs={learningTipTabs} bind:activeTab={activeLearningTipTab} activeColor="green" />
				</div>

				<!-- Filtered Learning Tips -->
				<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
					{#snippet children()}
						<div class="space-y-4">
							{#if filteredLearningTips.grammar.length > 0}
								{#each filteredLearningTips.grammar as tip}
									<GrammarTipCard {tip} />
								{/each}
							{/if}

							{#if filteredLearningTips.vocabulary.length > 0}
								{#each filteredLearningTips.vocabulary as tip}
									<VocabularyTipCard {tip} />
								{/each}
							{/if}

							{#if filteredLearningTips.phrases.length > 0}
								{#each filteredLearningTips.phrases as tip}
									<PhraseTipCard {tip} />
								{/each}
							{/if}

							{#if filteredLearningTips.grammar.length === 0 && filteredLearningTips.vocabulary.length === 0 && filteredLearningTips.phrases.length === 0}
								<p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
									No learning tips found for this category.
								</p>
							{/if}
						</div>
					{/snippet}
				</ScrollableWrapper>
			{:else}
				<div class="text-center py-8 text-gray-500 dark:text-gray-400">
					<p>No learning tips available yet.</p>
				</div>
			{/if}
		{/if}

		<!-- Feedback Tab -->
		{#if activeMainTab === 'feedback'}
			{#if feedbacks.length > 0}
				<div class="flex-shrink-0 mb-4">
					<!-- Subtype Tabs -->
					<Tabs tabs={feedbackTabs} bind:activeTab={activeFeedbackTab} activeColor="purple" />
				</div>

				<!-- Filtered Feedback -->
				<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
					{#snippet children()}
						<div class="space-y-4">
							{#if filteredFeedback.mistakes.length > 0}
								{#each filteredFeedback.mistakes as mistake}
									<MistakeCard {mistake} />
								{/each}
							{/if}

							{#if filteredFeedback.strengths.length > 0}
								{#each filteredFeedback.strengths as strength}
									<StrengthCard {strength} />
								{/each}
							{/if}

							{#if filteredFeedback.suggestions.length > 0}
								{#each filteredFeedback.suggestions as suggestion}
									<SuggestionCard {suggestion} />
								{/each}
							{/if}

							{#if filteredFeedback.mistakes.length === 0 && filteredFeedback.strengths.length === 0 && filteredFeedback.suggestions.length === 0}
								<p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
									No feedback found for this category.
								</p>
							{/if}
						</div>
					{/snippet}
				</ScrollableWrapper>
			{:else}
				<div class="text-center py-8 text-gray-500 dark:text-gray-400">
					<p>No feedback available yet.</p>
				</div>
			{/if}
		{/if}
	</div>
</div>
