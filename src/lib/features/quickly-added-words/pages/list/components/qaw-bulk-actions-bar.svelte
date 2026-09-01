<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import * as m from '$lib/paraglide/messages.js';
	import { Check, Square, SquareCheckBig, Trash2 } from 'lucide-svelte';

	interface Props {
		pageItemIds: string[];
		selectedIds?: string[];
		isBusy?: boolean;
		onApproveSelected: () => void;
		onRemoveSelected: () => void;
	}

	let {
		pageItemIds,
		selectedIds = $bindable([]),
		isBusy = false,
		onApproveSelected,
		onRemoveSelected
	}: Props = $props();

	const hasPageItems = $derived(pageItemIds.length > 0);
	const hasSelection = $derived(selectedIds.length > 0);
	const allPageSelected = $derived(
		hasPageItems && pageItemIds.every((id) => selectedIds.includes(id))
	);
	const isActionsDisabled = $derived(isBusy);
	const selectAllLabel = $derived(
		allPageSelected
			? m['features.quickly-added-words.list.bulk.unselect_all']()
			: m['features.quickly-added-words.list.bulk.select_all']()
	);

	function selectAllOnPage() {
		const merged = new Set([...selectedIds, ...pageItemIds]);
		selectedIds = [...merged];
	}

	function unselectAllOnPage() {
		const pageIds = new Set(pageItemIds);
		selectedIds = selectedIds.filter((id) => !pageIds.has(id));
	}

	function toggleSelectAllOnPage() {
		if (allPageSelected) {
			unselectAllOnPage();
		} else {
			selectAllOnPage();
		}
	}
</script>

<div
	class="mb-4 flex shrink-0 flex-wrap items-center gap-2"
	role="toolbar"
	aria-label={m['features.quickly-added-words.list.bulk.toolbar_aria_label']()}
>
	<Button
		type="FILLED"
		variant="TEXT"
		disabled={isActionsDisabled || !hasPageItems}
		onClick={toggleSelectAllOnPage}
	>
		{#if allPageSelected}
			<Square class="size-4 shrink-0" />
		{:else}
			<SquareCheckBig class="size-4 shrink-0" />
		{/if}
		<span>{selectAllLabel}</span>
	</Button>

	<Button
		type="FILLED"
		variant="TEXT"
		disabled={isActionsDisabled || !hasSelection}
		onClick={onApproveSelected}
	>
		<Check class="size-4 shrink-0" />
		<span>{m['features.quickly-added-words.list.bulk.approve_selected']()}</span>
	</Button>

	<Button
		type="OUTLINED"
		variant="DELETE"
		class="!bg-danger/10"
		disabled={isActionsDisabled || !hasSelection}
		onClick={onRemoveSelected}
	>
		<Trash2 class="size-4 shrink-0" />
		<span>{m['features.quickly-added-words.list.bulk.remove_selected']()}</span>
	</Button>
</div>
