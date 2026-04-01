import { describe, it, expect } from 'vitest';
import type { DailyActivityPoint } from '$lib/types/conversation/api/conversation-list-activity';
import { groupDailyActivityByMonth } from './group-daily-activity-by-month';
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

	it('groups consecutive days within the same month into one bucket', () => {
		const daily: DailyActivityPoint[] = [
			{ date: '2026-01-30', messageCount: 1 },
			{ date: '2026-01-31', messageCount: 2 }
		];
		const result = groupDailyActivityByMonth(daily);
		expect(result).toHaveLength(1);
		expect(result[0].monthKey).toBe('2026-01');
		expect(result[0].days).toEqual(daily);
		expect(result[0].label).toMatch(/Jan/);
	});

	it('splits when the calendar month changes', () => {
		const daily: DailyActivityPoint[] = [
			{ date: '2026-01-31', messageCount: 1 },
			{ date: '2026-02-01', messageCount: 0 }
		];
		const result = groupDailyActivityByMonth(daily);
		expect(result).toHaveLength(2);
		expect(result[0].monthKey).toBe('2026-01');
		expect(result[1].monthKey).toBe('2026-02');
		expect(result[0].days).toHaveLength(1);
		expect(result[1].days).toHaveLength(1);
	});
});

describe('buildMockConversationActivity', () => {
	it('produces 90 contiguous local calendar days ending on the anchor date', () => {
		const anchor = new Date(2026, 3, 1, 12, 0, 0, 0);
		const snapshot = buildMockConversationActivity(anchor);
		expect(snapshot.daily).toHaveLength(90);

		for (let i = 0; i < 90; i++) {
			const expected = addDaysYmd('2026-04-01', -(89 - i));
			expect(snapshot.daily[i].date).toBe(expected);
		}
	});

	it('is deterministic for the same anchor', () => {
		const anchor = new Date(2025, 6, 15, 12, 0, 0, 0);
		const a = buildMockConversationActivity(anchor);
		const b = buildMockConversationActivity(anchor);
		expect(a).toEqual(b);
	});
});
