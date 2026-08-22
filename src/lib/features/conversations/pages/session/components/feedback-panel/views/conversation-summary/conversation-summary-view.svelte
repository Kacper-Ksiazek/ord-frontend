<script lang="ts">
	import size from 'lodash/size';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { getSidepanelContext } from '../../../../contexts/sidepanel-context.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import type { SummaryTab } from '../../../../contexts/sidepanel-context.svelte';
	import { VerdictTab } from './tabs/verdict-tab';
	import { LearningTipsTab, UserMessageReviewsTab } from './tabs';
	import MessageFilterBanner from '../../components/message-filter-banner/message-filter-banner.svelte';
	import { ChevronLeft, ClipboardCheck, Lightbulb, MessageSquare } from 'lucide-svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	const messagesContext = getMessagesContext();
	const sidepanelContext = getSidepanelContext();
	const messages = $derived(messagesContext.messages);

	const userMessages = $derived(messages.filter((msg) => msg.sender === 'USER'));
	const aiMessages = $derived(messages.filter((msg) => msg.sender === 'AI'));

	const analysisCount = $derived(
		userMessages
			.map((msg) => msg.analysis)
			.filter((analysis) => analysis != null)
			.reduce(
				(acc, analysis) =>
					acc + size(analysis.mistakes) + size(analysis.strengths) + size(analysis.suggestions),
				0
			)
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

	const mainTabs = $derived<Tab<SummaryTab>[]>([
		{ id: 'verdict', label: 'Werdykt', icon: ClipboardCheck },
		{
			id: 'analysis',
			label: 'Przegląd',
			count: analysisCount,
			icon: MessageSquare,
			disabled: analysisCount === 0
		},
		{
			id: 'learning-tips',
			label: 'Wskazówki',
			count: learningTipsCount,
			icon: Lightbulb,
			disabled: learningTipsCount === 0
		}
	]);
</script>

<div class="flex flex-col h-full min-h-0" data-testid={E2E_TEST_IDS.session.feedbackSummary}>
	<div class="shrink-0 space-y-6">
		<Breadcrumb
			class="mb-3"
			crumbs={[
				{
					label: 'Zamknij',
					icon: ChevronLeft,
					onClick: () => {
						sidepanelContext.isOpened = false;
						sidepanelContext.filterMessageOrder = null;
					}
				}
			]}
		/>

		<h2 class="heading-5 mb-4 text-ink">Podsumowanie sesji</h2>

		<Tabs
			dataTestId={E2E_TEST_IDS.session.feedbackSummaryTabs}
			tabs={mainTabs}
			bind:activeTab={sidepanelContext.summaryTab}
			activeColor="primary"
			variant="outlined"
			class="mb-6"
		/>
	</div>

	<div class="flex-1 min-h-0 flex flex-col overflow-hidden">
		{#if sidepanelContext.summaryTab !== 'verdict'}
			<MessageFilterBanner />
		{/if}

		{#if sidepanelContext.summaryTab === 'verdict'}
			<div class="flex h-full min-h-0 flex-col overflow-hidden">
				<VerdictTab />
			</div>
		{/if}

		{#if sidepanelContext.summaryTab === 'learning-tips'}
			<div class="flex h-full min-h-0 flex-col overflow-hidden">
				<LearningTipsTab />
			</div>
		{/if}

		{#if sidepanelContext.summaryTab === 'analysis'}
			<div class="flex h-full min-h-0 flex-col overflow-hidden">
				<UserMessageReviewsTab />
			</div>
		{/if}
	</div>
</div>
