<script lang="ts" module>
	import type { CategoryFilterBase, FilterBase } from './types/utility-types';
</script>

<script
	lang="ts"
	generics="
		TData, 
		TCategory extends CategoryFilterBase, 
		TSubcategory extends string | null, 
		TFilters extends FilterBase<TCategory, TSubcategory>
	"
>
	import isEmpty from 'lodash/isEmpty';
	import { Inbox, RotateCcwIcon } from 'lucide-svelte';
	import type { FeedbackListWithFiltersBaseProps } from './types/props';
	import CategoriesAndSubcategories from './components/categories-and-subcategories.svelte';
	import Filters from './components/filters.svelte';
	import { applyFilters } from './utils/apply-filters';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { Button } from '$lib/components/buttons/button';

	let {
		items,
		categories,
		filters = $bindable(),
		customFilters,
		listItem,
		evaluateCustomFilters,
		areFiltersClearable,
		defaultFilters,
		emptyNoData,
		emptyFiltered
	}: FeedbackListWithFiltersBaseProps<TData, TCategory, TSubcategory, TFilters> = $props();

	const computedAreFiltersClearable = $derived(
		areFiltersClearable ??
			(defaultFilters
				? JSON.stringify(filters) !== JSON.stringify(defaultFilters)
				: filters.category !== ('ALL' satisfies CategoryFilterBase) ||
					filters.subcategory !== null ||
					filters.searchQuery.trim() !== '' ||
					(filters.defaultExpandState ?? false) === true)
	);

	const filteredItems = $derived(
		applyFilters({
			evaluateCustomFilters, //
			items,
			filters
		})
	);

	function clearFilters() {
		if (defaultFilters) {
			Object.assign(filters, defaultFilters);
		} else {
			Object.assign(filters, {
				category: 'ALL' satisfies CategoryFilterBase,
				subcategory: null,
				searchQuery: '',
				defaultExpandState: false
			});
		}
	}
</script>

<CategoriesAndSubcategories {categories} bind:filters />

<Filters
	bind:filters
	areFiltersClearable={computedAreFiltersClearable}
	{customFilters}
	{clearFilters}
/>

{#key Object.values(filters).join('-')}
	<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
		{#if !isEmpty(filteredItems)}
			<div class="space-y-4">
				{#each filteredItems as item, i (i)}
					{@render listItem({ item, defaultExpandState: filters.defaultExpandState ?? false })}
				{/each}
			</div>
		{:else if computedAreFiltersClearable}
			<div
				class="flex flex-col items-center justify-center gap-6 py-12 px-4 text-center flex-1"
				role="status"
				aria-live="polite"
			>
				<div class="flex flex-col items-center gap-3 max-w-sm">
					{#if emptyFiltered}
						{@render emptyFiltered()}
					{:else}
						<h3 class="heading-5 text-gray-900 dark:text-gray-100">No results match your filters</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							Try changing or clearing your filters to see more items.
						</p>
					{/if}
				</div>
				<Button type="OUTLINED" variant="DELETE" onClick={clearFilters}>
					<RotateCcwIcon class="w-4 h-4" />

					Reset filters
				</Button>
			</div>
		{:else}
			<div
				class="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center"
				role="status"
				aria-live="polite"
			>
				{#if emptyNoData}
					{@render emptyNoData()}
				{:else}
					<Inbox
						class="size-12 text-gray-400 dark:text-gray-500 shrink-0"
						strokeWidth={1.25}
						aria-hidden="true"
					/>
					<div class="flex flex-col gap-2 max-w-sm">
						<h3 class="heading-5 text-gray-900 dark:text-gray-100">Nothing here yet</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							There’s nothing to show right now. Check back after more activity in this conversation.
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</ScrollableWrapper>
{/key}
