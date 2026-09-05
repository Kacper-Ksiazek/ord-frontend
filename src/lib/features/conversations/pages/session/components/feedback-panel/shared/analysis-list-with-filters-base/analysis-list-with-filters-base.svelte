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
	import { Inbox, RotateCcwIcon } from 'lucide-svelte';
	import type { AnalysisListWithFiltersBaseProps } from './types/props';
	import type { FilterableItem } from './types/utility-types';
	import CategoriesAndSubcategories from './components/categories-and-subcategories.svelte';
	import Filters from './components/filters.svelte';
	import { applyFilters } from './utils/apply-filters';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { Button } from '$lib/components/buttons/button';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';

	const PAGE_SIZE = 20;

	let {
		items,
		categories,
		filters = $bindable(),
		customFilters,
		listItem,
		itemKey = (item: FilterableItem<TData, TCategory, TSubcategory>) =>
			`${item.category}-${item.subcategory ?? 'none'}-${item.searchableText}`,
		evaluateCustomFilters,
		areFiltersClearable,
		defaultFilters,
		emptyNoData,
		emptyFiltered
	}: AnalysisListWithFiltersBaseProps<TData, TCategory, TSubcategory, TFilters> = $props();

	let showCategoryCards = $state(true);
	let visibleLimit = $state(PAGE_SIZE);
	let scrollContainer: HTMLDivElement | undefined = $state(undefined);

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
			evaluateCustomFilters,
			items,
			filters
		})
	);

	const visibleItems = $derived(filteredItems.slice(0, visibleLimit));
	const hiddenItemCount = $derived(Math.max(0, filteredItems.length - visibleLimit));
	const filterResetKey = $derived(
		`${filters.category}-${filters.subcategory}-${filters.searchQuery}-${filters.defaultExpandState ?? false}`
	);

	const listScrollKey = $derived(`${filters.category}-${filters.subcategory ?? 'none'}`);

	let lastFilterResetKey = $state('');

	$effect(() => {
		if (filterResetKey !== lastFilterResetKey) {
			lastFilterResetKey = filterResetKey;
			visibleLimit = PAGE_SIZE;
		}
	});

	$effect(() => {
		void listScrollKey;

		if (!scrollContainer) {
			return;
		}

		scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
	});

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

	function showMoreItems() {
		visibleLimit += PAGE_SIZE;
	}
</script>

<div class="flex h-full min-h-0 flex-col gap-4">
	{#if showCategoryCards}
		<div class="overflow-hidden -m-1.5 p-1.5" transition:slide={{ duration: 220, easing: cubicOut }}>
			<CategoriesAndSubcategories {categories} bind:filters />
		</div>
	{/if}

	<Filters
		bind:filters
		bind:showCategoryCards
		areFiltersClearable={computedAreFiltersClearable}
		{customFilters}
		{clearFilters}
	/>

	<ScrollableWrapper bind:scrollContainer wrapperClass="min-h-0 flex-1" contentClass="px-0">
		{#if filteredItems.length > 0}
			<div class="space-y-4">
				{#each visibleItems as item (itemKey(item))}
					{@render listItem({ item, defaultExpandState: filters.defaultExpandState ?? false })}
				{/each}
			</div>

			{#if hiddenItemCount > 0}
				<div class="flex justify-center border-t border-line-subtle pt-3">
					<button
						type="button"
						class={cn(
							'rounded-md px-3 py-1.5 text-xs text-ink-muted transition-colors',
							'hover:bg-accent-soft hover:text-ink',
							'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
						)}
						onclick={showMoreItems}
					>
						Pokaż kolejne {Math.min(hiddenItemCount, PAGE_SIZE)}
					</button>
				</div>
			{/if}
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
						<h3 class="heading-5 text-ink">No results match your filters</h3>
						<p class="text-sm text-ink-muted">Try changing or clearing your filters to see more items.</p>
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
					<Inbox class="size-10 shrink-0 text-ink-subtle" strokeWidth={1.25} aria-hidden="true" />
					<div class="flex max-w-sm flex-col gap-2">
						<h3 class="heading-5 text-ink">Nothing here yet</h3>
						<p class="text-sm text-ink-muted">
							There’s nothing to show right now. Check back after more activity in this conversation.
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</ScrollableWrapper>
</div>
