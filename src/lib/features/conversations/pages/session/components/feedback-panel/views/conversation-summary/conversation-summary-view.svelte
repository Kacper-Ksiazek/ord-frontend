<script lang="ts">
	import size from 'lodash/size';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import { OverviewTab, LearningTipsTab, UserMessageReviewsTab } from './tabs';
	import { ChartBar, Lightbulb, MessageSquare } from 'lucide-svelte';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type {
		CompactConversationAiMessage,
		CompactConversationUserMessage
	} from '$lib/types/conversation/domain/conversation-message';

	type ConversationSummaryTab = 'overview' | 'learning-tips' | 'feedback';

	const messagesContext = getMessagesContext();
	const messages = $derived(messagesContext.messages);

	const userMessages: CompactConversationUserMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'USER')
	);
	const aiMessages: CompactConversationAiMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'AI')
	);

	const feedbacks: ConversationUserMessageFeedbackDTO[] = $derived(
		userMessages.map((msg) => msg.feedback).filter((f) => f !== null)
	);

	const feedbackCount = $derived(
		feedbacks.reduce((acc, f) => acc + size(f.mistakes) + size(f.strengths) + size(f.suggestions), 0)
	);

	const learningTipsCount = $derived(
		aiMessages.reduce(
			(acc, msg) =>
				acc +
				size(msg.learningTips?.grammarTips) +
				size(msg.learningTips?.vocabularyTips) +
				size(msg.learningTips?.phraseTips),
			0
		)
	);

	let activeMainTab = $state<ConversationSummaryTab>('overview');

	const mainTabs = $derived<Tab<ConversationSummaryTab>[]>([
		{ id: 'overview', label: 'Overview', icon: ChartBar },

		{
			id: 'learning-tips',
			label: 'Learning Tips',
			count: learningTipsCount,
			icon: Lightbulb,
			disabled: learningTipsCount === 0
		},

		{
			id: 'feedback',
			label: 'Feedback',
			count: feedbackCount,
			icon: MessageSquare,
			disabled: feedbackCount === 0
		}
	]);
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
			<UserMessageReviewsTab />
		{/if}
	</div>
</div>
