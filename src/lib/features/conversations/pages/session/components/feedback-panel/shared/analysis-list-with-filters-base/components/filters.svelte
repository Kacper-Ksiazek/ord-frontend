<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import {
		SearchIcon,
		TrashIcon,
		ChevronDown,
		ChevronUp,
		FoldVertical,
		UnfoldVertical
	} from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { FilterBase } from '../types/utility-types';

	interface Props {
		filters: FilterBase;
		showCategoryCards?: boolean;
		areFiltersClearable: boolean;
		customFilters?: Snippet;
		clearFilters: () => void;
	}

	let {
		filters = $bindable(),
		showCategoryCards = $bindable(true),
		areFiltersClearable,
		customFilters,
		clearFilters
	}: Props = $props();

	const isExpanded = $derived(filters.defaultExpandState ?? false);
	const expandCollapseIcon = $derived(isExpanded ? ChevronDown : ChevronUp);
	const expandCollapseTooltip = $derived(isExpanded ? 'Collapse all' : 'Expand all');

	function toggleExpandCollapse() {
		filters.defaultExpandState = !isExpanded;
	}

	const categoryCardsToggleIcon = $derived(showCategoryCards ? FoldVertical : UnfoldVertical);
	const categoryCardsToggleLabel = $derived(
		showCategoryCards ? 'Hide category filters' : 'Show category filters'
	);

	function toggleCategoryCards() {
		showCategoryCards = !showCategoryCards;
	}
</script>

<div class="flex items-center gap-1 mb-4">
	<Input
		bind:value={filters.searchQuery}
		placeholder="Search feedback..."
		class="flex-1"
		leftAdornment={SearchIcon}
	/>

	{#if customFilters}
		{@render customFilters()}
	{/if}

	<IconButton
		onClick={toggleCategoryCards}
		icon={categoryCardsToggleIcon}
		ariaLabel={categoryCardsToggleLabel}
		tooltip={categoryCardsToggleLabel}
		type="OUTLINED"
		variant="TEXT"
	/>

	<IconButton
		onClick={toggleExpandCollapse}
		icon={expandCollapseIcon}
		ariaLabel={expandCollapseTooltip}
		tooltip={expandCollapseTooltip}
		type="OUTLINED"
		variant="TEXT"
	/>

	<IconButton
		onClick={clearFilters}
		icon={TrashIcon}
		ariaLabel="Clear filters"
		tooltip="Clear filters"
		disabled={!areFiltersClearable}
		variant={areFiltersClearable ? 'DELETE' : 'TEXT'}
		type="OUTLINED"
	/>
</div>
