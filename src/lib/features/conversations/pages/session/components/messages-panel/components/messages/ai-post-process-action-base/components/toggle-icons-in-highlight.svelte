<script lang="ts">
	import { IconButton } from '$lib/components/actions/icon-button';
	import { Eye, EyeOff } from 'lucide-svelte';

	interface ToggleIconsInHighlightProps {
		showIconsInHighlightedParts: boolean;
	}

	let { showIconsInHighlightedParts = $bindable() }: ToggleIconsInHighlightProps = $props();

	const { Icon, tooltip } = $derived.by(() => {
		if (showIconsInHighlightedParts) {
			return {
				Icon: Eye,
				tooltip: 'Hide icons'
			};
		} else {
			return {
				Icon: EyeOff,
				tooltip: 'Show icons'
			};
		}
	});

	function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		showIconsInHighlightedParts = !showIconsInHighlightedParts;
	}
</script>

<IconButton
	icon={Icon}
	ariaLabel={tooltip}
	{tooltip}
	{onClick}
	type="OUTLINED"
	variant="TEXT"
	class="h-[32px] w-[32px] border-none"
/>
