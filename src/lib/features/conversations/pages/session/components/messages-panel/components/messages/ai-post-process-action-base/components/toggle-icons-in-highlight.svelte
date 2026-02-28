<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Eye, EyeOff } from 'lucide-svelte';

	interface ToggleIconsInHighlightProps {
		showIconsInHighlightedParts: boolean;
	}

	interface ToggleButtonSpec {
		Icon: LucideIcon;
		tooltip: string;
		onClick: () => void;
	}

	let { showIconsInHighlightedParts = $bindable() }: ToggleIconsInHighlightProps = $props();

	const iconsVisibilityControlSpec: ToggleButtonSpec = $derived.by(() => {
		if (showIconsInHighlightedParts) {
			return {
				Icon: Eye,
				tooltip: 'Hide icons',
				onClick: () => {
					showIconsInHighlightedParts = false;
				}
			} satisfies ToggleButtonSpec;
		} else {
			return {
				Icon: EyeOff,
				tooltip: 'Show icons',
				onClick: () => {
					showIconsInHighlightedParts = true;
				}
			} satisfies ToggleButtonSpec;
		}
	});
</script>

<IconButton
	icon={iconsVisibilityControlSpec.Icon}
	ariaLabel={iconsVisibilityControlSpec.tooltip}
	tooltip={iconsVisibilityControlSpec.tooltip}
	onClick={iconsVisibilityControlSpec.onClick}
	type="OUTLINED"
	variant="TEXT"
	class="w-8! h-8!"
/>
