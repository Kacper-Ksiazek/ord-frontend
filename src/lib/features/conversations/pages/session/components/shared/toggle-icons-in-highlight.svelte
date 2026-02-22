<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Eye, EyeOff } from 'lucide-svelte';

	interface ToggleIconsInHighlightProps {
		checked: boolean;
	}

	let { checked = $bindable() }: ToggleIconsInHighlightProps = $props();

	const { Icon, tooltip } = $derived.by(() => {
		if (checked) {
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

	function onClick() {
		checked = !checked;
	}
</script>

<IconButton
	icon={Icon}
	ariaLabel={tooltip}
	{tooltip}
	{onClick}
	type="OUTLINED"
	variant="TEXT"
	class="!w-8 !h-8"
/>
