<script lang="ts">
	import compact from 'lodash/compact';
	import flatMap from 'lodash/flatMap';
	import isEmpty from 'lodash/isEmpty';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import { OverviewTab, LearningTipsTab, FeedbackTab } from './tabs';
	import { ChartBar, Lightbulb, MessageSquare } from 'lucide-svelte';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type {
		CompactConversationAiMessage,
		CompactConversationUserMessage
	} from '$lib/types/conversation/domain/conversation-message';

	type ConversationSummaryTab = 'overview' | 'learning-tips' | 'feedback';

	const messagesContext = getMessagesContext();
	const messages = $derived(messagesContext.messages);

	// Basic counts
	const userMessages: CompactConversationUserMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'USER')
	);
	const aiMessages: CompactConversationAiMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'AI')
	);

	// Score statistics
	const feedbacks: ConversationUserMessageFeedbackDTO[] = $derived(
		userMessages.map((msg) => msg.feedback).filter((f) => f !== null)
	);

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

	// Main tabs
	let activeMainTab = $state<ConversationSummaryTab>('overview');

	const mainTabs = $derived<Tab<ConversationSummaryTab>[]>(
		compact([
			{ id: 'overview', label: 'Overview', count: messages.length, icon: ChartBar },

			totalLearningTips > 0 && {
				id: 'learning-tips',
				label: 'Learning Tips',
				count: totalLearningTips,
				icon: Lightbulb,
				disabled: false
			},

			!isEmpty(feedbacks) && {
				id: 'feedback',
				label: 'Feedback',
				count: totalMistakes + totalStrengths + totalSuggestions,
				icon: MessageSquare,
				disabled: false
			}
		])
	);
</script>

<div class="flex flex-col h-full min-h-0">
	<div class="shrink-0 space-y-6">
		<h2 class="heading-4 mb-4">Conversation Summary</h2>

		<Tabs
			tabs={mainTabs}
			bind:activeTab={activeMainTab}
			activeColor="primary"
			variant="outlined"
			class="mb-6"
		/>
	</div>

	<div class="flex-1 min-h-0 flex flex-col">
		{#if activeMainTab === 'overview'}
			<OverviewTab />
		{/if}

		{#if activeMainTab === 'learning-tips'}
			<LearningTipsTab />
		{/if}

		{#if activeMainTab === 'feedback'}
			<FeedbackTab />
		{/if}
	</div>
</div>
