import { describe, it, expect } from 'vitest';
import { HeatmapPercentile } from '$conversations/types';
import type { HeatmapDay } from '$conversations/types';
import { buildMonthWeekGrid, groupDailyActivityByMonth } from './group-daily-activity-by-month';
import { buildMockConversationActivity } from '../../mocks/conversation-activity.mock';

function addDaysYmd(ymd: string, delta: number): string {
	const [y, m, d] = ymd.split('-').map(Number);
	const date = new Date(y, m - 1, d);
	date.setDate(date.getDate() + delta);
	const yy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');

	return `${yy}-${mm}-${dd}`;
}

describe('groupDailyActivityByMonth', () => {
	it('returns empty array for empty input', () => {
		expect(groupDailyActivityByMonth([])).toEqual([]);
	});

	it('fills the entire calendar month for a single partial month', () => {
		const daily: HeatmapDay[] = [
			{ date: '2026-01-07', count: 1, percentile: HeatmapPercentile.P20 },
			{ date: '2026-01-08', count: 2, percentile: HeatmapPercentile.P40 }
		];
		const today = new Date(2026, 0, 15, 12, 0, 0, 0);
		const result = groupDailyActivityByMonth(daily, { today });
		expect(result).toHaveLength(1);
		expect(result[0].monthKey).toBe('2026-01');
		expect(result[0].days).toHaveLength(31);
		expect(result[0].days[0]).toEqual({
			date: '2026-01-01',
			count: 0,
			percentile: null,
			hasData: false,
			isFuture: false
		});
		expect(result[0].days[6]).toEqual({
			date: '2026-01-07',
			count: 1,
			percentile: HeatmapPercentile.P20,
			hasData: true,
			isFuture: false
		});
	});

	it('includes full months between partial start and end months', () => {
		const daily: HeatmapDay[] = [
			{ date: '2026-01-30', count: 1, percentile: HeatmapPercentile.P20 },
			{ date: '2026-01-31', count: 2, percentile: HeatmapPercentile.P40 },
			{ date: '2026-02-01', count: 0, percentile: HeatmapPercentile.P0 }
		];
		const today = new Date(2026, 2, 1, 12, 0, 0, 0);
		const result = groupDailyActivityByMonth(daily, { today });
		expect(result).toHaveLength(2);
		expect(result[0].days).toHaveLength(31);
		expect(result[1].days).toHaveLength(28);
		expect(result[1].days[0].hasData).toBe(true);
	});

	it('marks days after today as future', () => {
		const daily: HeatmapDay[] = [
			{ date: '2026-04-01', count: 3, percentile: HeatmapPercentile.P60 },
			{ date: '2026-04-03', count: 1, percentile: HeatmapPercentile.P20 }
		];
		const today = new Date(2026, 3, 3, 12, 0, 0, 0);
		const result = groupDailyActivityByMonth(daily, { today });
		expect(result).toHaveLength(1);
		expect(result[0].days).toHaveLength(30);
		const april3 = result[0].days.find((d) => d.date === '2026-04-03');
		const april4 = result[0].days.find((d) => d.date === '2026-04-04');
		expect(april3?.isFuture).toBe(false);
		expect(april3?.hasData).toBe(true);
		expect(april4?.isFuture).toBe(true);
		expect(april4?.hasData).toBe(false);
	});

	it('treats explicit zero in the payload as data', () => {
		const daily: HeatmapDay[] = [{ date: '2026-02-01', count: 0, percentile: HeatmapPercentile.P0 }];
		const today = new Date(2026, 2, 15, 12, 0, 0, 0);
		const result = groupDailyActivityByMonth(daily, { today });
		const feb1 = result[0].days.find((d) => d.date === '2026-02-01');
		expect(feb1?.hasData).toBe(true);
		expect(feb1?.count).toBe(0);
	});
});

describe('buildMonthWeekGrid', () => {
	it('lays out January 2026 with Monday-aligned weeks (Jan 1 is Thursday)', () => {
		const daily: HeatmapDay[] = [{ date: '2026-01-15', count: 1, percentile: HeatmapPercentile.P20 }];
		const today = new Date(2026, 0, 20, 12, 0, 0, 0);
		const group = groupDailyActivityByMonth(daily, { today })[0];
		const grid = buildMonthWeekGrid(group.days);

		expect(grid.numCols).toBe(5);
		expect(grid.cells).toHaveLength(35);
		// Column-major: col0 rows 0–2 pad, row 3 = Jan 1
		expect(grid.cells[0]).toBe(null);
		expect(grid.cells[1]).toBe(null);
		expect(grid.cells[2]).toBe(null);
		expect(grid.cells[3]?.date).toBe('2026-01-01');
		expect(grid.cells[6]?.date).toBe('2026-01-04');
	});

	it('returns empty grid for empty month array', () => {
		expect(buildMonthWeekGrid([])).toEqual({ numCols: 0, cells: [] });
	});
});

describe('buildMockConversationActivity', () => {
	it('produces 90 contiguous local calendar days ending on the anchor date', () => {
		const anchor = new Date(2026, 3, 1, 12, 0, 0, 0);
		const snapshot = buildMockConversationActivity(anchor);
		expect(snapshot.heatmap).toHaveLength(90);

		for (let i = 0; i < 90; i++) {
			const expected = addDaysYmd('2026-04-01', -(89 - i));
			expect(snapshot.heatmap[i].date).toBe(expected);
		}
	});

	it('is deterministic for the same anchor', () => {
		const anchor = new Date(2025, 6, 15, 12, 0, 0, 0);
		const a = buildMockConversationActivity(anchor);
		const b = buildMockConversationActivity(anchor);
		expect(a).toEqual(b);
	});
});
