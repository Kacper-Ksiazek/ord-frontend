<script lang="ts">
	import type { HomeActivityDay } from '$home/types';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { cn } from '$lib/utils/cn';
	import { CalendarDays } from 'lucide-svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import {
		buildYearHeatmap,
		formatYearHeatmapMonthLabel,
		formatYearHeatmapWeekdayLabels,
		heatmapCellFillClass,
		heatmapCellInMonth,
		heatmapTodayUtcKey,
		sliceHeatmapCellsForWeekRange
	} from '../utils/build-year-heatmap';

	interface Props {
		year: number;
		days: HomeActivityDay[];
	}

	const { year, days }: Props = $props();

	const locale = $derived(getLocale());

	const grid = $derived(
		buildYearHeatmap(year, days ?? [], (monthIndex) =>
			formatYearHeatmapMonthLabel(locale, year, monthIndex)
		)
	);

	const weekdayLabels = $derived(formatYearHeatmapWeekdayLabels(locale));

	const maxCount = $derived(Math.max(0, ...grid.cells.map((cell) => cell.count)));
	const todayUtc = $derived(heatmapTodayUtcKey());

	const cellSize = '15px';

	function cellLabel(date: string, count: number): string {
		if (count <= 0) {
			return m['features.home.home.heatmap_empty']({ date });
		}

		if (count === 1) {
			return m['features.home.home.heatmap_one']({ date });
		}

		return m['features.home.home.heatmap_n']({ date, count });
	}
</script>

<section class="flex min-w-0 flex-col gap-3" data-testid={E2E_TEST_IDS.home.heatmap}>
	<div class="flex min-w-0 items-center gap-2">
		<CalendarDays class="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
		<h2 class="text-base font-semibold tracking-tight text-ink">
			{m['features.home.home.activity_title']()}
			<span class="tabular-nums">{year}</span>
		</h2>
	</div>

	<div class="overflow-x-auto rounded-[10px] border border-line bg-surface p-4">
		<div
			class="flex w-max max-w-full items-start gap-2"
			role="grid"
			aria-label={m['features.home.home.heatmap_aria']({ year })}
		>
			<div class="flex shrink-0 flex-col gap-1" aria-hidden="true">
				<div class="h-[15px]"></div>
				{#each weekdayLabels as label, index (`${label}-${index}`)}
					<span class="flex h-[15px] items-center text-[10px] font-medium leading-none text-ink-subtle">
						{label}
					</span>
				{/each}
			</div>

			<div class="flex items-start gap-2">
				{#each grid.monthSpans as span (`${span.label}-${span.weekStart}`)}
					{@const weekColumns = span.weekEnd - span.weekStart + 1}
					{@const monthCells = sliceHeatmapCellsForWeekRange(grid.cells, span.weekStart, span.weekEnd)}
					<div class="flex shrink-0 flex-col gap-1">
						<span class="flex h-[15px] items-center text-[10px] font-medium leading-none text-ink-subtle">
							{span.label}
						</span>
						<div
							class="grid gap-1"
							style="grid-template-rows: repeat(7, {cellSize}); grid-template-columns: repeat({weekColumns}, {cellSize}); grid-auto-flow: column;"
						>
							{#each monthCells as cell, index (cell.date ?? `pad-${span.weekStart}-${index}`)}
								{#if heatmapCellInMonth(cell, year, span.monthIndex)}
									{@const label = cellLabel(cell.date ?? '', cell.count)}
									<span
										role="gridcell"
										class={cn('size-[15px] rounded-sm', heatmapCellFillClass(cell, maxCount, todayUtc))}
										title={label}
										aria-label={label}
									></span>
								{:else}
									<span class="size-[15px]" aria-hidden="true"></span>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
