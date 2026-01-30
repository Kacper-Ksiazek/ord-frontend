<script lang="ts">
	import compact from 'lodash/compact';
	import flatMap from 'lodash/flatMap';
	import isEmpty from 'lodash/isEmpty';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { Tabs } from '$lib/components/tabs';
	import type { Tab } from '$lib/components/tabs';
	import { OverviewTab, LearningTipsTab, FeedbackTab } from './tabs';
	import type { ConversationSummaryData } from './tabs';

	const messagesContext = getMessagesContext();

	const messages = $derived(messagesContext.messages);

	// Basic counts
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
		if (isEmpty(feedbacks)) return null;
		const sum = feedbacks.reduce((acc, f) => acc + (f.grammar ?? 0), 0);

		return sum / feedbacks.length;
	});

	const averageVocabulary = $derived.by(() => {
		if (isEmpty(feedbacks)) return null;
		const sum = feedbacks.reduce((acc, f) => acc + (f.vocabulary ?? 0), 0);

		return sum / feedbacks.length;
	});

	const averageNaturalness = $derived.by(() => {
		if (isEmpty(feedbacks)) return null;
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
		return flatMap(aiMessages, (msg) => msg.learningTips?.grammarTips ?? []);
	});

	const allVocabularyTips = $derived.by(() => {
		return flatMap(aiMessages, (msg) => msg.learningTips?.vocabularyTips ?? []);
	});

	const allPhraseTips = $derived.by(() => {
		return flatMap(aiMessages, (msg) => msg.learningTips?.phraseTips ?? []);
	});

	const totalLearningTips = $derived(
		allGrammarTips.length + allVocabularyTips.length + allPhraseTips.length
	);

	// Aggregate all feedback items
	const allMistakes = $derived.by(() => {
		return flatMap(feedbacks, (f) => f.mistakes ?? []);
	});

	const allStrengths = $derived.by(() => {
		return flatMap(feedbacks, (f) => f.strengths ?? []);
	});

	const allSuggestions = $derived.by(() => {
		return flatMap(feedbacks, (f) => f.suggestions ?? []);
	});

	// Main tabs
	let activeMainTab = $state<'overview' | 'learning-tips' | 'feedback'>('overview');

	const mainTabs = $derived.by(() => {
		return compact([
			{ id: 'overview', label: 'Overview', count: messages.length },
			totalLearningTips > 0 && {
				id: 'learning-tips',
				label: 'Learning Tips',
				count: totalLearningTips,
				disabled: false
			},
			!isEmpty(feedbacks) && {
				id: 'feedback',
				label: 'Feedback',
				count: totalMistakes + totalStrengths + totalSuggestions,
				disabled: false
			}
		]) satisfies Tab[];
	});

	// Prepare summary data for OverviewTab
	const summaryData = $derived<ConversationSummaryData>({
		messages,
		userMessages,
		aiMessages,
		messagesWithFeedback,
		feedbacks,
		totalMessages: messages.length,
		totalLearningTips,
		totalMistakes,
		totalStrengths,
		totalSuggestions,
		averageGrammar,
		averageVocabulary,
		averageNaturalness
	});
</script>

<div class="flex flex-col h-full min-h-0">
	<div class="shrink-0 space-y-6">
		<h2 class="text-xl font-bold mb-4 dark:text-gray-100">Conversation Summary</h2>

		<!-- Main Tabs -->
		<Tabs tabs={mainTabs} bind:activeTab={activeMainTab} activeColor="primary" class="mb-6" />
	</div>

	<!-- Content Area -->
	<div class="flex-1 min-h-0 flex flex-col">
		<!-- Overview Tab -->
		{#if activeMainTab === 'overview'}
			<OverviewTab data={summaryData} />
		{/if}

		<!-- Learning Tips Tab -->
		{#if activeMainTab === 'learning-tips'}
			<LearningTipsTab {allGrammarTips} {allVocabularyTips} {allPhraseTips} {totalLearningTips} />
		{/if}

		<!-- Feedback Tab -->
		{#if activeMainTab === 'feedback'}
			<FeedbackTab
				{allMistakes}
				{allStrengths}
				{allSuggestions}
				{totalMistakes}
				{totalStrengths}
				{totalSuggestions}
			/>
		{/if}
	</div>
</div>
