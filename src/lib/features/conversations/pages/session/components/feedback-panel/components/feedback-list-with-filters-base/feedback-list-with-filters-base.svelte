<script lang="ts" module>
	import type { CategoryFilterBase, FilterBase } from './types/utility-types';
</script>

<script
	lang="ts"
	generics="TData, TCategory extends CategoryFilterBase, TSubcategory extends string | null, TFilters extends FilterBase<TCategory, TSubcategory>"
>
	import isEmpty from 'lodash/isEmpty';
	import type { FeedbackListWithFiltersBaseProps } from './types/props';
	import CategoriesAndSubcategories from './components/categories-and-subcategories.svelte';
	import Filters from './components/filters.svelte';
	import { applyFilters } from './utils/apply-filters';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';

	let {
		items,
		categories,
		filters = $bindable(),
		customFilters,
		listItem,
		evaluateCustomFilters,
		areFiltersClearable,
		defaultFilters
	}: FeedbackListWithFiltersBaseProps<TData, TCategory, TSubcategory, TFilters> = $props();

	const computedAreFiltersClearable = $derived(
		areFiltersClearable ??
			(defaultFilters
				? JSON.stringify(filters) !== JSON.stringify(defaultFilters)
				: filters.category !== ('ALL' satisfies CategoryFilterBase) ||
					filters.subcategory !== null ||
					filters.searchQuery.trim() !== '')
	);

	const filteredItems = $derived(applyFilters({ evaluateCustomFilters, items, filters }));
</script>

<CategoriesAndSubcategories {categories} bind:filters />

<Filters
	bind:filters
	areFiltersClearable={computedAreFiltersClearable}
	{customFilters}
	clearFilters={() => {
		if (defaultFilters) {
			Object.assign(filters, defaultFilters);
		} else {
			Object.assign(filters, {
				category: 'ALL' satisfies CategoryFilterBase,
				subcategory: null,
				searchQuery: ''
			});
		}
	}}
/>

{#key Object.values(filters).join('-')}
	<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
		{#if !isEmpty(filteredItems)}
			<div class="space-y-4">
				{#each filteredItems as item, i (i)}
					{@render listItem({ item })}
				{/each}
			</div>
		{:else}
			<!-- {@render emptyState()} -->
		{/if}
	</ScrollableWrapper>
{/key}
