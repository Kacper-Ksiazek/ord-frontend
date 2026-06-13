<script lang="ts">
	import { IconButton } from '$lib/components/actions/icon-button';
	import * as m from '$lib/paraglide/messages.js';
	import { Check, CheckSquare, Square, Trash2 } from 'lucide-svelte';

	interface Props {
		pageItemIds: string[];
		selectedIds?: string[];
		disabled?: boolean;
		isBusy?: boolean;
		onApproveSelected: () => void;
		onRemoveSelected: () => void;
	}

	let {
		pageItemIds,
		selectedIds = $bindable([]),
		disabled = false,
		isBusy = false,
		onApproveSelected,
		onRemoveSelected
	}: Props = $props();

	const hasPageItems = $derived(pageItemIds.length > 0);
	const hasSelection = $derived(selectedIds.length > 0);
	const allPageSelected = $derived(
		hasPageItems && pageItemIds.every((id) => selectedIds.includes(id))
	);
	const isActionsDisabled = $derived(disabled || isBusy);

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
	<IconButton
		icon={allPageSelected ? Square : CheckSquare}
		ariaLabel={allPageSelected
			? m['features.quickly-added-words.list.bulk.unselect_all']()
			: m['features.quickly-added-words.list.bulk.select_all']()}
		tooltip={allPageSelected
			? m['features.quickly-added-words.list.bulk.unselect_all']()
			: m['features.quickly-added-words.list.bulk.select_all']()}
		type="OUTLINED"
		variant="PRIMARY"
		disabled={isActionsDisabled || !hasPageItems}
		onClick={toggleSelectAllOnPage}
	/>

	<IconButton
		icon={Check}
		ariaLabel={m['features.quickly-added-words.list.bulk.approve_selected']()}
		tooltip={m['features.quickly-added-words.list.bulk.approve_selected']()}
		type="OUTLINED"
		variant="PRIMARY"
		disabled={isActionsDisabled || !hasSelection}
		onClick={onApproveSelected}
	/>

	<IconButton
		icon={Trash2}
		ariaLabel={m['features.quickly-added-words.list.bulk.remove_selected']()}
		tooltip={m['features.quickly-added-words.list.bulk.remove_selected']()}
		type="OUTLINED"
		variant="DELETE"
		disabled={isActionsDisabled || !hasSelection}
		onClick={onRemoveSelected}
	/>
</div>
