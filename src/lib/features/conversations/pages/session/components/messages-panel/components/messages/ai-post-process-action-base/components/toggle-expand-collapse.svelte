<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { MessageSquareText } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';

	interface ToggleExpandCollapseProps {
		isCollapsed: boolean;
		expandLabel?: string;
		collapseLabel?: string;
	}

	let {
		isCollapsed = $bindable(),
		expandLabel = 'Komentarz',
		collapseLabel = 'Komentarz'
	}: ToggleExpandCollapseProps = $props();

	const ariaLabel = $derived(isCollapsed ? expandLabel : collapseLabel);

	function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		isCollapsed = !isCollapsed;
	}
</script>

<IconButton
	icon={MessageSquareText}
	{ariaLabel}
	tooltip={ariaLabel}
	{onClick}
	type="OUTLINED"
	variant="TEXT"
	class={cn('h-[32px] w-[32px] border-none', !isCollapsed && 'bg-accent-soft text-ink')}
/>
