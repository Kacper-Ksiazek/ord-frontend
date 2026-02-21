<script lang="ts">
	import { MessageSquareOffIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import { TrashIcon } from 'lucide-svelte';

	interface Props {
		onClearFilters: () => void;
	}

	const { onClearFilters }: Props = $props();
</script>

<div class="flex-1 flex flex-col items-center justify-center h-full text-muted">
	<MessageSquareOffIcon class="w-16 h-16 opacity-20" />
	<p class="text-muted-small text-center py-4">No learning tips to show for current filters.</p>

	<Button variant="DELETE" type="OUTLINED" onClick={onClearFilters} class="mt-4">
		<TrashIcon class="w-4 h-4" />
		<span> Clear filters</span>
	</Button>
</div>
