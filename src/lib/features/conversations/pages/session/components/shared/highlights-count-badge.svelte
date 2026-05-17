<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface HighlightsCountBadgeProps {
		count: number;
		label: string;
		iconColor: string;
		class: string;
		icon: Snippet;
	}

	const {
		count, //
		label,
		iconColor,
		class: className,
		icon
	}: HighlightsCountBadgeProps = $props();
</script>

{#if count > 0}
	<span
		class={cn(
			'inline-flex items-center gap-1.5 py-3 px-3 rounded-md text-xs font-medium h-8',
			'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300',
			className
		)}
	>
		<span class={cn('[&_svg]:size-3.5', iconColor)}>
			{@render icon()}
		</span>

		<span class="text-xs font-medium">{label} - </span>
		<span class="text-xs font-semibold">{count}</span>
	</span>
{/if}
