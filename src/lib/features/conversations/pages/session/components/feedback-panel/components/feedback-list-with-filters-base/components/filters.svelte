<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { SearchIcon, TrashIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { FilterBase } from '../types/utility-types';

	interface Props {
		filters: FilterBase;
		areFiltersClearable: boolean;
		customFilters?: Snippet;

		clearFilters: () => void;
	}

	let { filters = $bindable(), areFiltersClearable, customFilters, clearFilters }: Props = $props();
</script>

<div class="flex items-center gap-3 mb-4">
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
		onClick={clearFilters}
		icon={TrashIcon}
		ariaLabel="Clear filters"
		tooltip="Clear filters"
		disabled={!areFiltersClearable}
		variant={areFiltersClearable ? 'DELETE' : 'TEXT'}
		type="OUTLINED"
	/>
</div>
