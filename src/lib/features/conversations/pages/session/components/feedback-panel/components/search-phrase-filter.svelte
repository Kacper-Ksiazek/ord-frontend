<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { SearchIcon, TrashIcon } from 'lucide-svelte';

	interface Props {
		searchQuery: string;
		areFiltersClearable: boolean;
		clearFilters: () => void;
	}

	let { searchQuery = $bindable(), areFiltersClearable, clearFilters }: Props = $props();
</script>

<div class="flex items-center gap-3 mb-4">
	<Input
		bind:value={searchQuery}
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
