<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import {
		buildYearHeatmap,
		formatYearHeatmapMonthLabel,
		formatYearHeatmapWeekdayLabels,
		heatmapCellInMonth,
		sliceHeatmapCellsForWeekRange
	} from '../utils/build-year-heatmap';

	const cellSize = '15px';
	const year = new Date().getUTCFullYear();

	const locale = $derived(getLocale());

	const grid = $derived(
		buildYearHeatmap(year, [], (monthIndex) => formatYearHeatmapMonthLabel(locale, year, monthIndex))
	);

	const weekdayLabels = $derived(formatYearHeatmapWeekdayLabels(locale));
</script>

<section class="flex min-w-0 flex-col gap-3" aria-hidden="true">
	<div class="flex h-6 min-w-0 items-center gap-2">
		<div class="size-6 shrink-0 animate-pulse rounded-md bg-accent-soft"></div>
		<div class="h-6 w-32 max-w-full animate-pulse rounded-md bg-accent-soft"></div>
	</div>

	<div class="overflow-x-auto rounded-[10px] border border-line bg-surface p-4">
		<div class="flex w-max max-w-full items-start gap-2">
			<div class="flex shrink-0 flex-col gap-1" aria-hidden="true">
				<div class="h-[15px]"></div>
				{#each weekdayLabels as label, index (`${label}-${index}`)}
					<span
						class="flex h-[15px] items-center text-[10px] font-medium leading-none text-transparent select-none"
					>
						{label}
					</span>
				{/each}
			</div>

			<div class="flex items-start gap-2">
				{#each grid.monthSpans as span (`${span.label}-${span.weekStart}`)}
					{@const weekColumns = span.weekEnd - span.weekStart + 1}
					{@const monthCells = sliceHeatmapCellsForWeekRange(grid.cells, span.weekStart, span.weekEnd)}
					<div class="flex shrink-0 flex-col gap-1">
						<span
							class="flex h-[15px] items-center text-[10px] font-medium leading-none text-transparent select-none"
						>
							{span.label}
						</span>
						<div
							class="grid gap-1"
							style="grid-template-rows: repeat(7, {cellSize}); grid-template-columns: repeat({weekColumns}, {cellSize}); grid-auto-flow: column;"
						>
							{#each monthCells as cell, index (cell.date ?? `pad-${span.weekStart}-${index}`)}
								{#if heatmapCellInMonth(cell, year, span.monthIndex)}
									<div class="size-[15px] animate-pulse rounded-sm bg-accent-soft"></div>
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
