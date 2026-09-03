<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import * as m from '$lib/paraglide/messages.js';
	import { Check, Trash2 } from 'lucide-svelte';

	interface Props {
		itemId: string;
		isActivating: boolean;
		isDeleting: boolean;
		onActivate: (id: string) => void;
		onDelete: (id: string) => void;
	}

	let { itemId, isActivating, isDeleting, onActivate, onDelete }: Props = $props();

	const isBusy = $derived(isActivating || isDeleting);
	const activateLabel = m['features.words.inbox.actions.activate']();
	const deleteLabel = m['features.words.inbox.actions.delete']();
</script>

<div class="flex shrink-0 items-center gap-1">
	<IconButton
		icon={Check}
		ariaLabel={activateLabel}
		tooltip={activateLabel}
		type="OUTLINED"
		variant="PRIMARY"
		class="size-8 shrink-0 border-0 p-0"
		disabled={isBusy}
		onClick={() => onActivate(itemId)}
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
