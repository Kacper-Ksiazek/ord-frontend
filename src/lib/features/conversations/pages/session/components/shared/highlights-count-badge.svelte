<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';
	import type { Snippet } from 'svelte';

	interface HighlightsCountBadgeProps {
		count: number;
		label: string;
		color: TabsSupportedTailwindColor;
		class: string;
		icon: Snippet;
	}

	const {
		count, //
		label,
		color,
		class: className,
		icon
	}: HighlightsCountBadgeProps = $props();
</script>

{#if count > 0}
	<Badge
		{color}
		class={cn(
			'flex items-center gap-1.5 py-1.5 border', //
			'[&_svg]:w-3.5 [&_svg]:h-3.5',
			className
		)}
	>
		{@render icon()}

		<span class="text-xs font-medium">{label}</span>
		<span class="text-xs font-semibold">{count}</span>
	</Badge>
{/if}
