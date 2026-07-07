<script lang="ts">
	import size from 'lodash/size';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { getSidepanelContext } from '../../../../contexts/sidepanel-context.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import { OverviewTab, LearningTipsTab, UserMessageReviewsTab } from './tabs';
	import { ChartBar, ChevronLeft, Lightbulb, MessageSquare } from 'lucide-svelte';
	import type { ConversationUserMessageAnalysisDTO } from '$conversations/types';
	import type {
		CompactConversationAiMessage,
		CompactConversationUserMessage
	} from '$conversations/types';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	type ConversationSummaryTab = 'overview' | 'learning-tips' | 'analysis';

	const messagesContext = getMessagesContext();
	const sidepanelContext = getSidepanelContext();
	const messages = $derived(messagesContext.messages);

	const userMessages: CompactConversationUserMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'USER')
	);
	const aiMessages: CompactConversationAiMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'AI')
	);

	const analyses: ConversationUserMessageAnalysisDTO[] = $derived(
		userMessages.map((msg) => msg.analysis).filter((f) => f !== null)
	);

	const analysisCount = $derived(
		analyses.reduce((acc, f) => acc + size(f.mistakes) + size(f.strengths) + size(f.suggestions), 0)
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
			id: 'analysis',
			label: 'Analysis',
			count: analysisCount,
			icon: MessageSquare,
			disabled: analysisCount === 0
		}
	]);
</script>

<div class="flex flex-col h-full min-h-0" data-testid={E2E_TEST_IDS.session.feedbackSummary}>
	<div class="shrink-0 space-y-6">
		<Breadcrumb
			class="mb-3"
			crumbs={[
				{
					label: 'Close',
					icon: ChevronLeft,
					onClick: () => {
						sidepanelContext.isOpened = false;
					}
				}
			]}
		/>

		<h2 class="heading-4 mb-4">Conversation Summary</h2>

		<Tabs
			dataTestId={E2E_TEST_IDS.session.feedbackSummaryTabs}
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

		{#if activeMainTab === 'analysis'}
			<UserMessageReviewsTab />
		{/if}
	</div>
</div>
