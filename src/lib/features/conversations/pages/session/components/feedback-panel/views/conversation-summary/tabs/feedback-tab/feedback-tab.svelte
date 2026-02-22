<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import { DEFAULT_FEEDBACK_FILTERS } from './constants/default-filters';
	import type { FeedbackTabFilter, FeedbackTabFilters } from './feedback-tab.types';
	import { aggregateFeedback, countFeedback, filterFeedback, getFeedbackCards } from './utils';
	import { FeedbackStatCard, FeedbackFilters, EmptyScreen, SubcategoryFilters } from './components';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '$conversations/pages/session/components/shared/user-message-feedback/cards';
	import type {
		AggregatedMistake,
		AggregatedStrength,
		AggregatedSuggestion
	} from './utils/aggregate-feedback/aggregate-feedback.types';

	const messagesContext = getMessagesContext();

	const allAvailableFeedback = $derived(aggregateFeedback(messagesContext.messages));

	let filters = $state<FeedbackTabFilters>({
		tab: 'ALL',
		severity: 'ALL',
		suggestionType: 'ALL',
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

	function clearFilters() {
		filters = DEFAULT_FEEDBACK_FILTERS;
	}

	function selectTab(tabId: FeedbackTabFilter) {
		filters.tab = tabId;
		filters.severity = 'ALL';
		filters.suggestionType = 'ALL';
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

	<SubcategoryFilters bind:filters feedbacks={allAvailableFeedback} />

	<FeedbackFilters {filters} {clearFilters} />

	<!-- TODO: Teraz to jest zgrupowaen, a lepiej jest wyswietlac wszystko jedno za drugim jak leci - z jakims separatatorem wiadomosci najlepiej  -->
	{#key Object.values(filters).join('-')}
		<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
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
