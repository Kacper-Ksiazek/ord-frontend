<script lang="ts">
	import IconCard from '$lib/components/cards/icon-card/icon-card.svelte';
	import {
		aggregateLearningTips,
		type AggregatedLearningTip
	} from '../../shared/utils/aggregate-learning-tips';
	import { SubcategoryFilters, LearningTipFilters } from './components';
	import { LearningTipsList } from '../../shared/components/learning-tips-list';
	import type { LearningTipsListWithFiltersProps } from './learning-tips-list-with-filters.types';
	import { countLearningTips, getLearningTipCards } from './utils';
	import type { LearningTipCard } from './utils';
	import type { LearningTipCategoryFilter } from '../../shared/utils/filter-learning-tips';
	import { DEFAULT_LEARNING_TIP_FILTERS } from './lib/constants';
	import isEmpty from 'lodash/isEmpty';

	let {
		filters = $bindable(DEFAULT_LEARNING_TIP_FILTERS),
		messages
	}: LearningTipsListWithFiltersProps = $props();

	const aggregatedTips: AggregatedLearningTip[] = $derived(aggregateLearningTips(messages));

	// Count cards should always show totals, unaffected by any filters
	// Count directly from aggregated data without filtering
	const learningTipCards: LearningTipCard[] = $derived(
		getLearningTipCards({
			counts: countLearningTips(aggregatedTips)
		})
	);

	function selectTab(tabId: LearningTipCategoryFilter) {
		filters.category = tabId;
		filters.phraseType = 'ALL';
	}

	function clearFilters() {
		filters = DEFAULT_LEARNING_TIP_FILTERS;
	}
</script>

{#if !isEmpty(aggregatedTips)}
	<div class="flex justify-between items-center gap-2 mb-4">
		{#each learningTipCards as card (card.tabId)}
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

	<SubcategoryFilters bind:filters tips={aggregatedTips} />

	<LearningTipFilters bind:filters {clearFilters} />

	<LearningTipsList {filters} tips={aggregatedTips} {clearFilters} />
{:else}
	<div class="text-muted text-center py-8">
		<p>No learning tips available yet.</p>
	</div>
{/if}
