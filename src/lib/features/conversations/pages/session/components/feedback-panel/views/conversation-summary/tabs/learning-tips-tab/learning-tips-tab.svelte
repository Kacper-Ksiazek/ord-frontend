<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import {
		aggregateLearningTips,
		countLearningTips,
		filterLearningTips,
		getLearningTipCards
	} from './utils';
	import type { LearningTipsTabFilters } from './learning-tips-tab.types';
	import { LearningTipStatCard } from './components/learning-tip-stat-card';
	import LearningTipFilters from './components/learning-tip-filters/learning-tip-filters.svelte';
	import EmptyScreen from './components/empty-screen.svelte';
	import {
		GrammarTipCard,
		PhraseTipCard,
		VocabularyTipCard
	} from '$conversations/pages/session/components/shared/ai-message-learning-tips/cards';

	const messagesContext = getMessagesContext();

	const allAvailableLearningTips = $derived(aggregateLearningTips(messagesContext.messages));

	let scrollContainer = $state<HTMLDivElement | undefined>(undefined);
	let filters = $state<LearningTipsTabFilters>({
		register: 'ALL',
		tab: 'ALL',
		searchQuery: ''
	});

	const tipsToRender = $derived(filterLearningTips(allAvailableLearningTips, filters));
	const learningTipsCounts = $derived(
		countLearningTips(
			filterLearningTips(allAvailableLearningTips, {
				...filters,
				tab: 'ALL'
			})
		)
	);
	const learningTipCards = $derived(getLearningTipCards(learningTipsCounts));

	function clearFilters() {
		filters.register = 'ALL';
		filters.searchQuery = '';
	}

	function selectTab(tabId: LearningTipCategory | 'ALL') {
		filters.tab = tabId;

		if (scrollContainer) {
			scrollContainer.scrollTop = 0;
		}
	}
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#each learningTipCards as card}
		<LearningTipStatCard
			count={card.count}
			tabId={card.tabId}
			isCardActive={filters.tab === card.tabId}
			onSelect={() => selectTab(card.tabId)}
		/>
	{/each}
</div>

<LearningTipFilters {filters} {clearFilters} />

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0" bind:scrollContainer>
	{#if !isEmpty(tipsToRender)}
		<div class="space-y-4">
			{#each tipsToRender as tip}
				{#if tip.type === 'GRAMMAR'}
					<GrammarTipCard tip={tip.data} />
				{:else if tip.type === 'VOCABULARY'}
					<VocabularyTipCard tip={tip.data} />
				{:else if tip.type === 'PHRASES'}
					<PhraseTipCard tip={tip.data} />
				{/if}
			{/each}
		</div>
	{:else}
		<EmptyScreen onClearFilters={clearFilters} />
	{/if}
</ScrollableWrapper>
