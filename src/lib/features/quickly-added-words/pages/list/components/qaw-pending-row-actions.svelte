<script lang="ts">
	import { IconButton } from '$lib/components/actions/icon-button';
	import { m } from '$lib/paraglide/messages.js';
	import { Check, Trash2 } from 'lucide-svelte';

	interface Props {
		itemId: string;
		isApproving: boolean;
		isDeleting: boolean;
		onApprove: (id: string) => void;
		onDelete: (id: string) => void;
	}

	let { itemId, isApproving, isDeleting, onApprove, onDelete }: Props = $props();

	const isBusy = $derived(isApproving || isDeleting);
	const confirmLabel = m['features.quickly-added-words.list.actions.confirm']();
	const deleteLabel = m['features.quickly-added-words.list.actions.delete']();
</script>

<div class="flex shrink-0 items-center gap-1">
	<IconButton
		icon={Check}
		ariaLabel={confirmLabel}
		tooltip={confirmLabel}
		type="OUTLINED"
		variant="PRIMARY"
		class="size-8 shrink-0 border-0 p-0"
		disabled={isBusy}
		onClick={() => onApprove(itemId)}
	/>

	<IconButton
		icon={Trash2}
		ariaLabel={deleteLabel}
		tooltip={deleteLabel}
		type="OUTLINED"
		variant="DELETE"
		class="size-8 shrink-0 border-0 p-0"
		disabled={isBusy}
		onClick={() => onDelete(itemId)}
	/>
</div>
