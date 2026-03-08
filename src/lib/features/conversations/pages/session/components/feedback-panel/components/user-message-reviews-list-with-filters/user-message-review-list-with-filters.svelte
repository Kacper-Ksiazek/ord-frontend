<script lang="ts">
	import IconCard from '$lib/components/cards/icon-card/icon-card.svelte';
	import {
		aggregateFeedback,
		type AggregatedFeedbackItem
	} from '../../shared/utils/aggregate-feedback';
	import { SubcategoryFilters } from './components';
	import { UserMessageReviewsList } from '../../shared/components/user-message-reviews-list';
	import type { FeedbackCategoryFilter } from './lib/filters';
	import type { UserMessageReviewListWithFiltersProps } from './user-message-review-list-with-filters.types';
	import { countFeedback, getFeedbackCards } from './utils';
	import type { FeedbackCard } from './utils/get-feedback-cards';
	import isEqual from 'lodash/isEqual';
	import { DEFAULT_FEEDBACK_FILTERS } from './lib/constants';
	import SearchPhraseFilter from '../search-phrase-filter.svelte';
	import isEmpty from 'lodash/isEmpty';

	let { filters = $bindable(), messages }: UserMessageReviewListWithFiltersProps = $props();

	const aggregatedFeedback: AggregatedFeedbackItem[] = $derived(aggregateFeedback(messages));

	// Count cards should always show totals, unaffected by any filters
	// Count directly from aggregated data without filtering
	const feedbackCards: FeedbackCard[] = $derived(
		getFeedbackCards({
			counts: countFeedback(aggregatedFeedback)
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
