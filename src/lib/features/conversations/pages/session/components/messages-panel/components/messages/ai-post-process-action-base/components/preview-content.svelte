<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { PanelRightClose, PanelRightOpen } from 'lucide-svelte';

	interface PreviewContentProps {
		isSelected?: boolean;
		onClick?: (e: MouseEvent) => void;
	}

	let { isSelected = false, onClick: onClickProp }: PreviewContentProps = $props();

	const { Icon, tooltip } = $derived.by(() => {
		if (isSelected) {
			return {
				Icon: PanelRightClose,
				tooltip: 'Close panel'
			};
		} else {
			return {
				Icon: PanelRightOpen,
				tooltip: 'Open panel'
			};
		}
	});

	function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		onClickProp?.(e);
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
