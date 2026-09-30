import { describe, expect, it } from 'vitest';
import { activityFillClass, buildYearHeatmap } from './build-year-heatmap';

const monthNames = (monthIndex: number) =>
	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex] ??
	'';

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

describe('activityFillClass', () => {
	describe('positive path', () => {
		it('should darken higher counts relative to the year max', () => {
			expect(activityFillClass(8, 8)).toBe('bg-ink');
			expect(activityFillClass(1, 8)).toBe('bg-primary-200');
		});
	});

	describe('negative path', () => {
		it('should keep a zero day pale', () => {
			expect(activityFillClass(0, 8)).toBe('bg-accent-soft');
		});
	});

	describe('edge cases', () => {
		it('should stay pale when the year has no activity', () => {
			expect(activityFillClass(0, 0)).toBe('bg-accent-soft');
		});
	});
});
