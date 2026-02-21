<script lang="ts">
	import isEqual from 'lodash/isEqual';
	import { DEFAULT_FEEDBACK_FILTERS } from '../../constants/default-filters';
	import Input from '$lib/components/forms/input/input.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { SearchIcon, TrashIcon } from 'lucide-svelte';
	import type { FeedbackTabFilters } from '../../feedback-tab.types';

	interface Props {
		filters: FeedbackTabFilters;
		clearFilters: () => void;
	}

	let { filters = $bindable(), clearFilters }: Props = $props();

	const areFiltersClearable = $derived(!isEqual(filters, DEFAULT_FEEDBACK_FILTERS));
</script>

<div class="flex items-center gap-3 mb-4">
	<Input
		bind:value={filters.searchQuery}
		placeholder="Search feedback..."
		class="flex-1"
		leftAdornment={SearchIcon}
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
