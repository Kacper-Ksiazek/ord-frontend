import type {
	HeatmapDay,
	HeatmapPercentile
} from '$conversations/types/api/conversation-list-activity';

export interface HeatmapDayCell {
	date: string;
	count: number;
	percentile: HeatmapPercentile | null;
	/** True when this day appears in the API payload (including explicit zero). */
	hasData: boolean;
	/** True when the calendar day is strictly after "today" in local time. */
	isFuture: boolean;
}

export interface DailyActivityMonthGroup {
	/** `YYYY-MM` for stable keys */
	monthKey: string;
	/** Human-readable month heading */
	label: string;
	days: HeatmapDayCell[];
}

export interface GroupDailyActivityByMonthOptions {
	/** Defaults to `new Date()`. Pass a fixed date in tests. */
	today?: Date;
}

function formatLocalYmd(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	return `${y}-${m}-${day}`;
}

function parseYmd(date: string): { y: number; m: number; d: number } {
	const [ys, ms, ds] = date.split('-');
	const y = Number(ys);
	const m = Number(ms);
	const d = Number(ds);

	return { y, m, d };
}

function monthKeyFromParts(y: number, m: number): string {
	return `${y}-${String(m).padStart(2, '0')}`;
}

function monthLabel(y: number, m: number): string {
	return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric'
	});
}

function daysInMonth(y: number, m: number): number {
	return new Date(y, m, 0).getDate();
}

function* eachMonthInclusive(
	yStart: number,
	mStart: number,
	yEnd: number,
	mEnd: number
): Generator<{ y: number; m: number }> {
	let y = yStart;
	let m = mStart;

	while (y < yEnd || (y === yEnd && m <= mEnd)) {
		yield { y, m };
		m += 1;
		if (m > 12) {
			m = 1;
			y += 1;
		}
	}
}

/**
 * Splits activity into month buckets and pads each calendar month with every local day
 * from the first to the last day of the month, for months touched by the data range.
 * Days outside the API range or in the future use {@link HeatmapDayCell.hasData} /
 * {@link HeatmapDayCell.isFuture} for styling.
 */
export function groupDailyActivityByMonth(
	daily: HeatmapDay[],
	options?: GroupDailyActivityByMonthOptions
): DailyActivityMonthGroup[] {
	if (daily.length === 0) return [];

	const today = options?.today ?? new Date();
	const todayStr = formatLocalYmd(today);

	const byDate = new Map<string, HeatmapDay>();
	let minDate = daily[0].date;
	let maxDate = daily[0].date;

	for (const point of daily) {
		byDate.set(point.date, point);
		if (point.date < minDate) minDate = point.date;
		if (point.date > maxDate) maxDate = point.date;
	}

	const start = parseYmd(minDate);
	const end = parseYmd(maxDate);
	const groups: DailyActivityMonthGroup[] = [];

	for (const { y, m } of eachMonthInclusive(start.y, start.m, end.y, end.m)) {
		const dim = daysInMonth(y, m);
		const days: HeatmapDayCell[] = [];

		for (let d = 1; d <= dim; d += 1) {
			const date = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
			const row = byDate.get(date);
			const hasData = byDate.has(date);
			const count = row?.count ?? 0;
			const percentile = row?.percentile ?? null;
			const isFuture = date > todayStr;

			days.push({ date, count, percentile, hasData, isFuture });
		}

		groups.push({
			monthKey: monthKeyFromParts(y, m),
			label: monthLabel(y, m),
			days
		});
	}

	return groups;
}

/** Row index 0 = Monday … 6 = Sunday (ISO weekday order for the grid). */
export const HEATMAP_WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export interface MonthWeekGrid {
	/** Number of week columns (Mon–Sun stacks). */
	numCols: number;
	/**
	 * Column-major order: column 0 is Mon→Sun, then column 1, etc.
	 * `null` pads weeks before/after the month inside the ISO week alignment.
	 */
	cells: (HeatmapDayCell | null)[];
}

/**
 * Arranges a month’s days into columns of calendar weeks (Monday-aligned).
 * Each row is one weekday; row 0 is Monday, row 6 is Sunday.
 */
export function buildMonthWeekGrid(days: HeatmapDayCell[]): MonthWeekGrid {
	if (days.length === 0) {
		return { numCols: 0, cells: [] };
	}

	const { y, m } = parseYmd(days[0].date);
	const dim = days.length;
	const first = new Date(y, m - 1, 1);
	const jsDow = first.getDay();
	/** Monday = 0 … Sunday = 6 */
	const mondayBasedRow = (jsDow + 6) % 7;
	const leading = mondayBasedRow;
	const totalSlots = leading + dim;
	const numCols = Math.ceil(totalSlots / 7);
	const cells: (HeatmapDayCell | null)[] = [];

	for (let col = 0; col < numCols; col += 1) {
		for (let row = 0; row < 7; row += 1) {
			const slot = col * 7 + row;
			if (slot < leading) {
				cells.push(null);
			} else {
				const dom = slot - leading + 1;
				if (dom > dim) {
					cells.push(null);
				} else {
					cells.push(days[dom - 1]);
				}
			}
		}
	}

	return { numCols, cells };
}
