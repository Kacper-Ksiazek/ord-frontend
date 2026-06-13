<script lang="ts">
	import { ActionMenu } from '$lib/components/actions/action-menu';
	import { Copy, Pencil, Trash2 } from 'lucide-svelte';

	interface Props {
		itemId: string;
	}

	let { itemId }: Props = $props();

	const menuItems = [
		{ label: 'Lorem edit word', icon: Pencil },
		{ label: 'Ipsum duplicate', icon: Copy },
		{ label: 'Dolor delete', icon: Trash2, variant: 'delete' as const }
	];
</script>

<ActionMenu items={menuItems} ariaLabel="Word actions for {itemId}" />
