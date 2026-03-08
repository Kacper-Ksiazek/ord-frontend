<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import RegisterFilter from './components/register-filter.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { SearchIcon, TrashIcon } from 'lucide-svelte';
	import type { LearningTipFilters } from '../../lib/filters';

	interface Props {
		filters: LearningTipFilters;
		clearFilters: () => void;
	}

	let { filters = $bindable(), clearFilters }: Props = $props();

	const areFiltersClearable = $derived(
		filters.category !== 'ALL' ||
			filters.register !== 'ALL' ||
			filters.phraseType !== 'ALL' ||
			filters.searchQuery.trim() !== ''
	);
</script>

<div class="flex items-center gap-3 mb-4">
	<Input
		bind:value={filters.searchQuery}
		placeholder="Search tips..."
		class="flex-1"
		leftAdornment={SearchIcon}
	/>

	<RegisterFilter bind:value={filters.register} />

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
