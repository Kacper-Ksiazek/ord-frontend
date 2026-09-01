<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { HeatmapPercentile } from '$conversations/types';
	import type { HeatmapDay } from '$conversations/types';
	import * as m from '$lib/paraglide/messages.js';
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
			return 'bg-accent-soft';
		}
		if (point.percentile === null) {
			return 'bg-line';
		}
		switch (point.percentile) {
			case HeatmapPercentile.P0:
				return 'bg-line';
			case HeatmapPercentile.P20:
				return 'bg-primary-200';
			case HeatmapPercentile.P40:
				return 'bg-primary-300';
			case HeatmapPercentile.P60:
				return 'bg-primary-500';
			case HeatmapPercentile.P80:
				return 'bg-ink';
			default:
				return 'bg-ink';
		}
	}

	function ariaLabel(point: HeatmapDayCell): string {
		if (point.isFuture) {
			return m['features.conversation.list.activity.heatmap_future']({ date: point.date });
		}
		if (!point.hasData) {
			return m['features.conversation.list.activity.heatmap_no_data']({ date: point.date });
		}
		if (point.count === 0) {
			return m['features.conversation.list.activity.heatmap_no_messages']({ date: point.date });
		}
		if (point.count === 1) {
			return m['features.conversation.list.activity.heatmap_one_message']({ date: point.date });
		}

		return m['features.conversation.list.activity.heatmap_n_messages']({
			date: point.date,
			count: point.count
		});
	}
</script>

<div
	class={cn(
		'min-w-0 rounded-[10px] border border-line bg-surface p-4 text-ink-muted',
		monthGroups.length > 0 && 'flex items-start'
	)}
	role="group"
	aria-label={m['features.conversation.list.activity.heatmap_aria']()}
>
	{#if monthGroups.length > 0}
		<div class="flex shrink-0 flex-col gap-2" aria-hidden="true">
			<!-- Matches month title row height so weekday labels line up with heatmap rows -->
			<div class="invisible select-none text-[10px] font-medium leading-none text-ink-subtle">
				{monthGroups[0].label}
			</div>
			<div class="flex flex-col gap-1 pt-px">
				{#each HEATMAP_WEEKDAY_LABELS as label (label)}
					<span class="flex h-4 items-center text-[10px] font-medium leading-none text-ink-subtle">
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
						class="text-[10px] font-medium leading-none text-ink-subtle"
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
								{@const cellLabel = ariaLabel(cell)}
								<span
									role="gridcell"
									class={cn('size-4 shrink-0 rounded-sm transition-colors', dotClasses(cell))}
									title={cellLabel}
									aria-label={cellLabel}
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
