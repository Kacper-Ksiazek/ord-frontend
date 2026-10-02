import { describe, expect, it } from 'vitest';
import {
	HEATMAP_FUTURE_CLASS,
	HEATMAP_PAST_QUIET_CLASS,
	activityFillClass,
	buildYearHeatmap,
	formatYearHeatmapMonthLabel,
	formatYearHeatmapWeekdayLabels,
	heatmapCellFillClass,
	heatmapCellInMonth,
	isHeatmapFutureDay,
	sliceHeatmapCellsForWeekRange
} from './build-year-heatmap';

const monthNames = (monthIndex: number) =>
	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex] ??
	'';

describe('formatYearHeatmapWeekdayLabels', () => {
	it('should format seven UTC weekdays starting on Monday for the app locale', () => {
		const labels = formatYearHeatmapWeekdayLabels('pl');

		expect(labels).toHaveLength(7);
		expect(labels[0]?.toLowerCase()).toMatch(/pon/);
	});
});

describe('formatYearHeatmapMonthLabel', () => {
	it('should format a short month name for the app locale', () => {
		expect(formatYearHeatmapMonthLabel('pl', 2026, 8).toLowerCase()).toMatch(/wrz/);
	});
});

describe('buildYearHeatmap', () => {
	describe('positive path', () => {
		it('should place a counted day and keep empty days of that year', () => {
			const grid = buildYearHeatmap(2026, [{ date: '2026-09-30', count: 4 }], monthNames);
			const september = grid.cells.find((cell) => cell.date === '2026-09-30');
			const quiet = grid.cells.find((cell) => cell.date === '2026-01-02');

			expect(september?.count).toBe(4);
			expect(quiet).toEqual({ date: '2026-01-02', count: 0 });
			expect(grid.cells.filter((cell) => cell.date !== null)).toHaveLength(365);
		});

		it('should align weeks to Monday in UTC', () => {
			const grid = buildYearHeatmap(2026, [], monthNames);

			expect(grid.cells[0]?.date).toBeNull();
			expect(grid.cells[3]).toEqual({ date: '2026-01-01', count: 0 });
			expect(grid.monthLabels[0]).toEqual({ column: 0, label: 'Jan' });
			expect(grid.monthLabels).toHaveLength(12);
			expect(grid.monthSpans[0]).toEqual({
				label: 'Jan',
				monthIndex: 0,
				weekStart: 0,
				weekEnd: 4
			});
			expect(grid.monthSpans).toHaveLength(12);
		});

		it('should include every day of each month inside its week span', () => {
			const grid = buildYearHeatmap(2026, [], monthNames);
			const february = grid.monthSpans[1];
			const februaryCells = sliceHeatmapCellsForWeekRange(
				grid.cells,
				february.weekStart,
				february.weekEnd
			);

			expect(februaryCells.filter((cell) => heatmapCellInMonth(cell, 2026, 1)).length).toBe(28);
		});

		it('should not treat adjacent-month days in a shared week as belonging to the wrong month', () => {
			const grid = buildYearHeatmap(2026, [], monthNames);
			const februarySpan = grid.monthSpans[1];
			const februaryCells = sliceHeatmapCellsForWeekRange(
				grid.cells,
				februarySpan.weekStart,
				februarySpan.weekEnd
			);
			const januaryDayInFebruarySlice = februaryCells.find((cell) =>
				cell.date?.startsWith('2026-01-')
			);

			expect(januaryDayInFebruarySlice).toBeDefined();
			if (!januaryDayInFebruarySlice) {
				return;
			}
			expect(heatmapCellInMonth(januaryDayInFebruarySlice, 2026, 1)).toBe(false);
		});
	});

	describe('negative path', () => {
		it('should ignore days outside the requested year and non-positive counts', () => {
			const grid = buildYearHeatmap(
				2026,
				[
					{ date: '2025-12-31', count: 9 },
					{ date: '2026-02-01', count: 0 }
				],
				monthNames
			);

			expect(grid.cells.find((cell) => cell.date === '2026-02-01')?.count).toBe(0);
			expect(grid.cells.some((cell) => cell.date === '2025-12-31')).toBe(false);
		});
	});

	describe('edge cases', () => {
		it('should cover a leap year and start on Monday when January 1 is Monday', () => {
			const grid = buildYearHeatmap(2024, [], monthNames);

			expect(grid.cells[0]).toEqual({ date: '2024-01-01', count: 0 });
			expect(grid.cells.filter((cell) => cell.date !== null)).toHaveLength(366);
			expect(grid.cells.some((cell) => cell.date === '2024-12-31')).toBe(true);
		});
	});
});

describe('heatmapCellFillClass', () => {
	it('should use a muted canvas fill for future days without activity', () => {
		const cell = { date: '2026-12-31', count: 0 };

		expect(heatmapCellFillClass(cell, 4, '2026-10-02')).toBe(HEATMAP_FUTURE_CLASS);
	});

	it('should keep accent-soft for past quiet days', () => {
		const cell = { date: '2026-01-02', count: 0 };

		expect(heatmapCellFillClass(cell, 4, '2026-10-02')).toBe(HEATMAP_PAST_QUIET_CLASS);
	});

	it('should still shade days that had activity', () => {
		const cell = { date: '2026-09-30', count: 4 };

		expect(heatmapCellFillClass(cell, 4, '2026-10-02')).toBe('bg-ink dark:bg-primary-600');
	});
});

describe('isHeatmapFutureDay', () => {
	it('should compare UTC date keys lexicographically', () => {
		expect(isHeatmapFutureDay('2026-10-03', '2026-10-02')).toBe(true);
		expect(isHeatmapFutureDay('2026-10-02', '2026-10-02')).toBe(false);
	});
});

describe('activityFillClass', () => {
	describe('positive path', () => {
		it('should darken higher counts relative to the year max', () => {
			expect(activityFillClass(8, 8)).toBe('bg-ink dark:bg-primary-600');
			expect(activityFillClass(1, 8)).toBe('bg-primary-200 dark:bg-primary-200');
		});
	});

	describe('negative path', () => {
		it('should keep a zero day pale', () => {
			expect(activityFillClass(0, 8)).toBe(HEATMAP_PAST_QUIET_CLASS);
		});
	});

	describe('edge cases', () => {
		it('should stay pale when the year has no activity', () => {
			expect(activityFillClass(0, 0)).toBe(HEATMAP_PAST_QUIET_CLASS);
		});
	});
});
