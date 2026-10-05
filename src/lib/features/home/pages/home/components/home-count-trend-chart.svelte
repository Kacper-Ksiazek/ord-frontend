<script lang="ts">
	import type { HomeActivityDay } from '$home/types';
	import { defineChart, lineY } from '@tanstack/charts';
	import { scaleLinear } from '@tanstack/charts/scales/linear';
	import { scalePoint } from '@tanstack/charts/scales/point';
	import {
		CHART_MARGINS_COMPACT,
		TanStackChart,
		getChartInkDisabled,
		getChartInkMuted
	} from '$lib/components/charts';
	import { cn } from '$lib/utils/cn';

	interface Props {
		days: HomeActivityDay[];
		ariaLabel: string;
		disabled?: boolean;
		class?: string;
		'data-testid'?: string;
	}

	const {
		days,
		ariaLabel,
		disabled = false,
		class: className = '',
		'data-testid': dataTestId
	}: Props = $props();

	const lineColor = $derived(disabled ? getChartInkDisabled() : getChartInkMuted());

	const rows = $derived(
		days.map((day, index) => ({
			id: day.date,
			index,
			value: day.count
		}))
	);

	const definition = $derived(
		defineChart({
			marks: [
				lineY(rows, {
					id: 'home-count-trend',
					x: 'index',
					y: 'value',
					points: false,
					stroke: lineColor,
					strokeWidth: 1.5
				})
			],
			x: {
				scale: () => scalePoint<number>().padding(0.05),
				axis: false
			},
			y: {
				scale: scaleLinear,
				nice: true,
				axis: false,
				grid: false
			},
			margin: CHART_MARGINS_COMPACT,
			focusRing: false,
			tooltip: false
		})
	);
</script>

<div
	class={cn('pointer-events-none min-h-[4.5rem] w-full min-w-0 select-none', className)}
	data-testid={dataTestId}
	role="img"
	aria-label={ariaLabel}
>
	{#if days.length > 0}
		<TanStackChart {definition} {ariaLabel} height={72} initialWidth={160} />
	{:else}
		<div class="h-full min-h-[4.5rem]" aria-hidden="true"></div>
	{/if}
</div>
