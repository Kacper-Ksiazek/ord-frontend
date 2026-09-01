<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface HighlightsCountBadgeProps {
		count: number;
		label: string;
		iconColor: string;
		class?: string;
		icon: Snippet;
	}

	const {
		count, //
		label,
		iconColor,
		class: className = '',
		icon
	}: HighlightsCountBadgeProps = $props();
</script>

{#if count > 0}
	<span title={label} class={cn('inline-flex items-center gap-1 text-xs text-ink-muted', className)}>
		<span class={cn('[&_svg]:size-3.5', iconColor)}>
			{@render icon()}
		</span>
		<span class="tabular-nums font-medium text-ink">{count}</span>
	</span>
{/if}
