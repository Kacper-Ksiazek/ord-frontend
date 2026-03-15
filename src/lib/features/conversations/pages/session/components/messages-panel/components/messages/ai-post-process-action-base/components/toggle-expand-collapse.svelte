<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	interface ToggleExpandCollapseProps {
		isCollapsed: boolean;
	}

	let { isCollapsed = $bindable() }: ToggleExpandCollapseProps = $props();

	const { Icon, tooltip } = $derived.by(() => {
		if (isCollapsed) {
			return {
				Icon: ChevronUp,
				tooltip: 'Expand'
			};
		} else {
			return {
				Icon: ChevronDown,
				tooltip: 'Collapse'
			};
		}
	});

	function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		isCollapsed = !isCollapsed;
	}
</script>

<IconButton
	icon={Icon}
	ariaLabel={tooltip}
	{tooltip}
	{onClick}
	type="OUTLINED"
	variant="TEXT"
	class="h-[32px] w-[32px]"
/>
