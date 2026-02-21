<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import SeverityFilter from './components/severity-filter.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { SearchIcon, TrashIcon } from 'lucide-svelte';
	import type { FeedbackTabFilters } from '../../feedback-tab.types';

	interface Props {
		filters: FeedbackTabFilters;
		clearFilters: () => void;
		showSeverityFilter: boolean;
	}

	let { filters = $bindable(), clearFilters, showSeverityFilter }: Props = $props();

	const areFiltersClearable = $derived(
		filters.severity !== 'ALL' || filters.searchQuery.trim() !== ''
	);
</script>

<div class="flex items-center gap-3 mb-4">
	<Input
		bind:value={filters.searchQuery}
		placeholder="Search feedback..."
		class="flex-1"
		leftAdornment={SearchIcon}
	/>

	{#if showSeverityFilter}
		<SeverityFilter bind:value={filters.severity} />
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
