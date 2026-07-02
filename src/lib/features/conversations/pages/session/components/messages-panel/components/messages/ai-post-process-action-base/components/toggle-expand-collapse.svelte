<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Button } from '$lib/components/buttons/button';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	interface ToggleExpandCollapseProps {
		isCollapsed: boolean;
		showLabel?: boolean;
	}

	let { isCollapsed = $bindable(), showLabel = false }: ToggleExpandCollapseProps = $props();

	const { Icon, tooltip, label } = $derived.by(() => {
		if (isCollapsed) {
			return {
				Icon: ChevronUp,
				tooltip: 'Expand',
				label: 'Expand'
			};
		} else {
			return {
				Icon: ChevronDown,
				tooltip: 'Collapse',
				label: 'Collapse'
			};
		}
	});

	function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		isCollapsed = !isCollapsed;
	}
</script>

{#if showLabel}
	<Button type="OUTLINED" variant="TEXT" {onClick} class="gap-2">
		<Icon class="w-4 h-4" />
		{label}
	</Button>
{:else}
	<IconButton
		icon={Icon}
		ariaLabel={tooltip}
		{tooltip}
		{onClick}
		type="OUTLINED"
		variant="TEXT"
		class="h-[32px] w-[32px] border-none"
	/>
{/if}
