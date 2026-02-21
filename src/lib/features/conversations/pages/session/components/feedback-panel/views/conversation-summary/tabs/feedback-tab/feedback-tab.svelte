<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import type { FeedbackTabFilter, FeedbackTabFilters } from './feedback-tab.types';
	import { aggregateFeedback, countFeedback, filterFeedback, getFeedbackCards } from './utils';
	import { FeedbackStatCard } from './components/feedback-stat-card';
	import FeedbackFilters from './components/feedback-filters/feedback-filters.svelte';
	import EmptyScreen from './components/empty-screen.svelte';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '../../../../../shared/user-message-feedback/cards';
	import type {
		AggregatedMistake,
		AggregatedStrength,
		AggregatedSuggestion
	} from './utils/aggregate-feedback/aggregate-feedback.types';

	const messagesContext = getMessagesContext();

	const allAvailableFeedback = $derived(aggregateFeedback(messagesContext.messages));

	let scrollContainer = $state<HTMLDivElement | undefined>(undefined);
	let filters = $state<FeedbackTabFilters>({
		tab: 'ALL',
		severity: 'ALL',
		searchQuery: ''
	});

	const feedbackToRender = $derived(filterFeedback(allAvailableFeedback, filters));
	const feedbackCounts = $derived(
		countFeedback(
			filterFeedback(allAvailableFeedback, {
				...filters,
				tab: 'ALL'
			})
		)
	);
	const feedbackCards = $derived(getFeedbackCards(feedbackCounts));

	const hasAnyFeedback = $derived(!isEmpty(allAvailableFeedback));
	const showSeverityFilter = $derived(
		(filters.tab === 'ALL' || filters.tab === 'MISTAKES') && hasAnyFeedback
	);

	function clearFilters() {
		filters.severity = 'ALL';
		filters.searchQuery = '';
	}

	function selectTab(tabId: FeedbackTabFilter) {
		filters.tab = tabId;

		if (scrollContainer) {
			scrollContainer.scrollTop = 0;
		}
	}

	const groupedFeedback = $derived.by(() => {
		const mistakes: AggregatedMistake[] = [];
		const strengths: AggregatedStrength[] = [];
		const suggestions: AggregatedSuggestion[] = [];

		for (const item of feedbackToRender) {
			if (item.type === 'MISTAKES') {
				mistakes.push(item);
			} else if (item.type === 'STRENGTHS') {
				strengths.push(item);
			} else if (item.type === 'SUGGESTIONS') {
				suggestions.push(item);
			}
		}

		return { mistakes, strengths, suggestions };
	});
</script>

{#if hasAnyFeedback}
	<div class="flex justify-between items-center gap-2 mb-4">
		{#each feedbackCards as card}
			<FeedbackStatCard
				count={card.count}
				tabId={card.tabId}
				isCardActive={filters.tab === card.tabId}
				onSelect={() => selectTab(card.tabId)}
			/>
		{/each}
	</div>

	<FeedbackFilters {filters} {clearFilters} {showSeverityFilter} />

	{#key Object.values(filters).join('-')}
		<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0" bind:scrollContainer>
			{#if !isEmpty(feedbackToRender)}
				<div class="space-y-4">
					{#each groupedFeedback.mistakes as item}
						<MistakeCard mistake={item.data} />
					{/each}

					{#each groupedFeedback.strengths as item}
						<StrengthCard strength={item.data} />
					{/each}

					{#each groupedFeedback.suggestions as item}
						<SuggestionCard suggestion={item.data} />
					{/each}
				</div>
			{:else}
				<EmptyScreen onClearFilters={clearFilters} />
			{/if}
		</ScrollableWrapper>
	{/key}
{:else}
	<div class="text-muted text-center py-8">
		<p>No feedback available yet.</p>
	</div>
{/if}
