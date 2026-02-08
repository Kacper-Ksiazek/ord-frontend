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

	// Average characters per message
	const averageUserMessageCharacters = $derived.by(() => {
		if (isEmpty(userMessages)) return null;
		const totalChars = userMessages.reduce((acc, msg) => acc + (msg.content?.length ?? 0), 0);
		return Math.round(totalChars / userMessages.length);
	});

	const averageAiMessageCharacters = $derived.by(() => {
		if (isEmpty(aiMessages)) return null;
		const totalChars = aiMessages.reduce((acc, msg) => acc + (msg.content?.length ?? 0), 0);
		return Math.round(totalChars / aiMessages.length);
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

	// Mistakes by severity
	const mistakesBySeverity = $derived.by(() => {
		const severity1 = allMistakes.filter((m) => m.severity === 'MINOR').length;
		const severity2 = allMistakes.filter((m) => m.severity === 'MODERATE').length;
		const severity3 = allMistakes.filter((m) => m.severity === 'CRITICAL').length;
		return { severity1, severity2, severity3 };
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

	// Learning tips by category
	const learningTipsByCategory = $derived.by(() => {
		return {
			grammar: allGrammarTips.length,
			vocabulary: allVocabularyTips.length,
			phrases: allPhraseTips.length
		};
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
		mistakesBySeverity,
		learningTipsByCategory,
		averageGrammar,
		averageVocabulary,
		averageNaturalness,
		averageUserMessageCharacters,
		averageAiMessageCharacters
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
			<LearningTipsTab />
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
