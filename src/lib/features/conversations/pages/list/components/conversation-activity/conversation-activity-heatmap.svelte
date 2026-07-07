<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { HeatmapPercentile } from '$conversations/types';
	import type { HeatmapDay } from '$conversations/types';
	import {
		buildMonthWeekGrid,
		groupDailyActivityByMonth,
		HEATMAP_WEEKDAY_LABELS,
		type HeatmapDayCell
	} from './group-daily-activity-by-month';

	interface Props {
		heatmap: HeatmapDay[];
	}

	const { heatmap }: Props = $props();

	const monthGroups = $derived(groupDailyActivityByMonth(heatmap));

	function dotClasses(point: HeatmapDayCell): string {
		if (point.isFuture || !point.hasData) {
			return 'bg-gray-100 dark:bg-gray-800';
		}
		if (point.percentile === null) {
			return 'bg-gray-200 dark:bg-gray-700';
		}
		switch (point.percentile) {
			case HeatmapPercentile.P0:
				return 'bg-gray-200 dark:bg-gray-700';
			case HeatmapPercentile.P20:
				return 'bg-primary-300 dark:bg-primary-700';
			case HeatmapPercentile.P40:
				return 'bg-primary-400 dark:bg-primary-600';
			case HeatmapPercentile.P60:
				return 'bg-primary-500 dark:bg-primary-500';
			case HeatmapPercentile.P80:
				return 'bg-primary-600 dark:bg-primary-400';
			default:
				return 'bg-primary-600 dark:bg-primary-500';
		}
	}

	function ariaLabel(point: HeatmapDayCell): string {
		if (point.isFuture) {
			return `${point.date}: Future`;
		}
		if (!point.hasData) {
			return `${point.date}: No data`;
		}
		const c = point.count;
		const label = c === 0 ? 'No messages' : c === 1 ? '1 message' : `${c} messages`;

		return `${point.date}: ${label}`;
	}

	function titleText(point: HeatmapDayCell): string {
		if (point.isFuture) {
			return `${point.date}: Future`;
		}
		if (!point.hasData) {
			return `${point.date}: No data`;
		}
		const c = point.count;

		return `${point.date}: ${c} message${c === 1 ? '' : 's'}`;
	}
</script>

<div
	class={cn(
		'min-w-0',
		'bg-gray-50 dark:bg-gray-700/50',
		'text-gray-600 dark:text-gray-400',
		'border-gray-200 dark:border-gray-600 border rounded-lg p-4',
		monthGroups.length > 0 && 'flex items-start'
	)}
	role="group"
	aria-label="Message activity by month; each row is a weekday from Monday through Sunday"
>
	{#if monthGroups.length > 0}
		<div class="flex shrink-0 flex-col gap-2" aria-hidden="true">
			<!-- Matches month title row height so weekday labels line up with heatmap rows -->
			<div
				class="invisible select-none text-[10px] font-medium leading-none text-gray-400 dark:text-gray-500"
			>
				{monthGroups[0].label}
			</div>
			<div class="flex flex-col gap-1 pt-px">
				{#each HEATMAP_WEEKDAY_LABELS as label (label)}
					<span
						class="flex h-4 items-center text-[10px] font-medium leading-none text-gray-400 dark:text-gray-500"
					>
						{label}
					</span>
				{/each}
			</div>
		</div>

		<div class="flex min-w-0 flex-1 gap-4">
			{#each monthGroups as group (group.monthKey)}
				{@const weekGrid = buildMonthWeekGrid(group.days)}
				<div class="flex min-w-0 flex-col gap-2 md:shrink-0">
					<div
						class="text-[10px] font-medium leading-none text-gray-400 dark:text-gray-500"
						id="activity-month-{group.monthKey}"
					>
						{group.label}
					</div>

					<div
						class="grid min-w-0 gap-1"
						style="grid-template-rows: repeat(7, minmax(0, auto)); grid-template-columns: repeat({weekGrid.numCols}, minmax(0, auto)); grid-auto-flow: column;"
						role="grid"
						aria-labelledby="activity-month-{group.monthKey}"
					>
						{#each weekGrid.cells as cell, i (cell?.date ?? `${group.monthKey}-pad-${i}`)}
							{#if cell}
								<span
									role="gridcell"
									class={cn('size-4 shrink-0 rounded-sm transition-colors', dotClasses(cell))}
									title={titleText(cell)}
									aria-label={ariaLabel(cell)}
								></span>
							{:else}
								<span class="size-4 shrink-0" aria-hidden="true" role="presentation"></span>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
