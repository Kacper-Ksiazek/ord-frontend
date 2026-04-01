import type { DailyActivityPoint } from '$lib/types/conversation/api/conversation-list-activity';

export interface DailyActivityMonthGroup {
	/** `YYYY-MM` for stable keys */
	monthKey: string;
	/** Human-readable month heading */
	label: string;
	days: DailyActivityPoint[];
}

function parseYmd(date: string): { y: number; m: number } {
	const [ys, ms] = date.split('-');
	const y = Number(ys);
	const m = Number(ms);

	return { y, m };
}

function monthKeyFromYmd(date: string): string {
	const { y, m } = parseYmd(date);

	return `${y}-${String(m).padStart(2, '0')}`;
}

function monthLabel(y: number, m: number): string {
	return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric'
	});
}

/**
 * Splits ascending `daily` points into month buckets for UI grouping.
 */
export function groupDailyActivityByMonth(daily: DailyActivityPoint[]): DailyActivityMonthGroup[] {
	if (daily.length === 0) return [];

	const groups: DailyActivityMonthGroup[] = [];
	let current: DailyActivityMonthGroup | null = null;

	for (const point of daily) {
		const key = monthKeyFromYmd(point.date);
		const { y, m } = parseYmd(point.date);

		if (!current || current.monthKey !== key) {
			current = {
				monthKey: key,
				label: monthLabel(y, m),
				days: [point]
			};
			groups.push(current);
		} else {
			current.days.push(point);
		}
	}

	return groups;
}
