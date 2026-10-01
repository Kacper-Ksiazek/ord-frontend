<script lang="ts">
	import type { HomeActivityDay } from '$home/types';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import {
		YEAR_HEATMAP_WEEKDAY_LABELS,
		activityFillClass,
		buildYearHeatmap
	} from '../utils/build-year-heatmap';

	interface Props {
		year: number;
		days: HomeActivityDay[];
	}

	const { year, days }: Props = $props();

	const grid = $derived(
		buildYearHeatmap(year, days ?? [], (monthIndex) =>
			new Intl.DateTimeFormat(undefined, { month: 'short', timeZone: 'UTC' }).format(
				new Date(Date.UTC(year, monthIndex, 1))
			)
		)
	);

	const maxCount = $derived(Math.max(0, ...grid.cells.map((cell) => cell.count)));

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

<section class="flex flex-col gap-3" data-testid={E2E_TEST_IDS.home.heatmap}>
	<h2 class="text-sm font-medium text-ink-muted">
		{m['features.home.home.activity_title']()}
		<span class="tabular-nums text-ink">{year}</span>
	</h2>

	<div class="overflow-x-auto">
		<div
			class="flex w-max items-start gap-2"
			role="grid"
			aria-label={m['features.home.home.heatmap_aria']({ year })}
		>
			<div class="flex shrink-0 flex-col gap-1" aria-hidden="true">
				<div class="h-4"></div>
				{#each YEAR_HEATMAP_WEEKDAY_LABELS as label (label)}
					<span class="flex h-4 items-center text-[10px] font-medium leading-none text-ink-subtle">
						{label}
					</span>
				{/each}
			</div>

			<div class="flex flex-col gap-1">
				<div class="grid h-4 gap-1" style="grid-template-columns: repeat({grid.weekCount}, 1rem);">
					{#each grid.monthLabels as month (month.label)}
						<span
							class="text-[10px] font-medium leading-none text-ink-subtle"
							style="grid-column: {month.column + 1};"
						>
							{month.label}
						</span>
					{/each}
				</div>

				<div
					class="grid gap-1"
					style="grid-template-rows: repeat(7, 1rem); grid-template-columns: repeat({grid.weekCount}, 1rem); grid-auto-flow: column;"
				>
					{#each grid.cells as cell, index (cell.date ?? `pad-${index}`)}
						{#if cell.date}
							{@const label = cellLabel(cell.date, cell.count)}
							<span
								role="gridcell"
								class={cn('size-4 rounded-sm', activityFillClass(cell.count, maxCount))}
								title={label}
								aria-label={label}
							></span>
						{:else}
							<span class="size-4" aria-hidden="true"></span>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
