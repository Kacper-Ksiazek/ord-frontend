<script lang="ts">
	import IconCard from '$lib/components/cards/icon-card/icon-card.svelte';
	import { aggregateFeedback, type AggregatedFeedbackItem } from './utils/aggregate-feedback';
	import { SubcategoryFilters, UserMessageReviewsList } from './components';
	import type { FeedbackCategoryFilter } from './lib/filters';
	import type { UserMessageReviewFiltersProps } from './user-message-review-filters.types';
	import { countFeedback, getFeedbackCards } from './utils';
	import type { FeedbackCard } from './utils/get-feedback-cards';
	import { filterUserMessageReviews } from '../../shared/filter-user-message-reviews/filter-user-message-reviews';
	import isEqual from 'lodash/isEqual';
	import { DEFAULT_FEEDBACK_FILTERS } from './lib/constants';
	import SearchPhraseFilter from '../search-phrase-filter.svelte';
	import isEmpty from 'lodash/isEmpty';

	let { filters = $bindable(), messages }: UserMessageReviewFiltersProps = $props();

	const aggregatedFeedback: AggregatedFeedbackItem[] = $derived(aggregateFeedback(messages));

	const feedbackCards: FeedbackCard[] = $derived(
		getFeedbackCards({
			counts: countFeedback(
				filterUserMessageReviews(aggregatedFeedback, {
					...filters,
					category: 'ALL'
				})
			)
		})
	);

	const areFiltersClearable: boolean = $derived(!isEqual(filters, DEFAULT_FEEDBACK_FILTERS));

	function selectTab(tabId: FeedbackCategoryFilter) {
		filters.category = tabId;
		filters.mistakeSeverity = 'ALL';
		filters.suggestionType = 'ALL';
	}

	function clearFilters() {
		filters = DEFAULT_FEEDBACK_FILTERS;
	}
</script>

{#if !isEmpty(aggregatedFeedback)}
	<div class="flex justify-between items-center gap-2 mb-4">
		{#each feedbackCards as card (card.tabId)}
			<IconCard
				title={card.title}
				value={card.count}
				variant={card.variant}
				isActive={filters.category === card.tabId}
				disabled={card.count === 0}
				onclick={() => selectTab(card.tabId)}
			>
				{#snippet icon({ className })}
					<card.Icon class={className} />
				{/snippet}
			</IconCard>
		{/each}
	</div>

	<SubcategoryFilters bind:filters feedbacks={aggregatedFeedback} />

	<SearchPhraseFilter bind:searchQuery={filters.searchQuery} {areFiltersClearable} {clearFilters} />

	<UserMessageReviewsList {filters} feedbacks={aggregatedFeedback} {clearFilters} />
{:else}
	<div class="text-muted text-center py-8">
		<p>No feedback available yet.</p>
	</div>
{/if}
