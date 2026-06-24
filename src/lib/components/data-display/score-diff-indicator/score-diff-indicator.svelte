<script lang="ts">
	import { ArrowUp, ArrowDown } from 'lucide-svelte';
	import { cn } from 'flowbite-svelte';

	interface ScoreDiffIndicatorProps {
		currentScore: number | null;
		averageScore: number;
		class?: string;
	}

	let { currentScore, averageScore, class: className = '' }: ScoreDiffIndicatorProps = $props();

	const diff = $derived(currentScore !== null ? currentScore - averageScore : null);
	const isPositive = $derived(diff !== null && diff > 0);
	const isNegative = $derived(diff !== null && diff < 0);
	const diffValue = $derived(diff !== null ? Math.abs(diff).toFixed(1) : null);
</script>

{#if diffValue !== null && diff !== 0}
	<span
		class={cn(
			'inline-flex items-center gap-0.5 text-sm font-medium',
			isPositive ? 'text-success' : isNegative ? 'text-error' : '',
			className
		)}
	>
		{#if isPositive}
			<ArrowUp class="w-3.5 h-3.5" />
		{:else if isNegative}
			<ArrowDown class="w-3.5 h-3.5" />
		{/if}
		{diffValue}
	</span>
{/if}
