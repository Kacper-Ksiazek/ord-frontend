<script lang="ts">
	import type { DomChartDefinition } from '@tanstack/charts';
	import { Chart } from '@tanstack/charts/svelte';
	import { cn } from '$lib/utils/cn';

	interface TanStackChartProps {
		definition: DomChartDefinition;
		ariaLabel: string;
		height?: number;
		aspectRatio?: number;
		class?: string;
		initialWidth?: number;
	}

	let {
		definition,
		ariaLabel,
		height,
		aspectRatio,
		class: className = '',
		initialWidth = 640
	}: TanStackChartProps = $props();
</script>

<Chart
	{definition}
	{ariaLabel}
	{height}
	{aspectRatio}
	{initialWidth}
	class={cn('w-full', className)}
/>
