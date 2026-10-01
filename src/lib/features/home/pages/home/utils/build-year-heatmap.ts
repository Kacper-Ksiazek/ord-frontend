import type { HomeActivityDay } from '$home/types';

export const YEAR_HEATMAP_WEEKDAY_LABELS = [
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat',
	'Sun'
] as const;

export interface YearHeatmapCell {
	date: string | null;
	count: number;
}

export interface YearHeatmapMonthLabel {
	column: number;
	label: string;
}

export interface YearHeatmapMonthSpan {
	label: string;
	monthIndex: number;
	weekStart: number;
	weekEnd: number;
}

export function heatmapCellInMonth(
	cell: YearHeatmapCell,
	year: number,
	monthIndex: number
): boolean {
	if (!cell.date) {
		return false;
	}

	const date = new Date(`${cell.date}T00:00:00Z`);

	return date.getUTCFullYear() === year && date.getUTCMonth() === monthIndex;
}

export interface YearHeatmap {
	year: number;
	weekCount: number;
	cells: YearHeatmapCell[];
	monthLabels: YearHeatmapMonthLabel[];
	monthSpans: YearHeatmapMonthSpan[];
}

export function sliceHeatmapCellsForWeekRange(
	cells: YearHeatmapCell[],
	weekStart: number,
	weekEnd: number
): YearHeatmapCell[] {
	const sliced: YearHeatmapCell[] = [];

	for (let column = weekStart; column <= weekEnd; column += 1) {
		for (let row = 0; row < 7; row += 1) {
			sliced.push(cells[column * 7 + row]);
		}
	}

	return sliced;
}

function isLeapYear(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInYear(year: number): number {
	return isLeapYear(year) ? 366 : 365;
}

function utcDate(year: number, monthIndex: number, day: number): Date {
	return new Date(Date.UTC(year, monthIndex, day));
}

function formatUtc(date: Date): string {
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');

	return `${date.getUTCFullYear()}-${month}-${day}`;
}

/** Monday = 0 … Sunday = 6, from a UTC date. */
function mondayIndex(date: Date): number {
	return (date.getUTCDay() + 6) % 7;
}

export function activityFillClass(count: number, max: number): string {
	if (count <= 0 || max <= 0) {
		return 'bg-accent-soft';
	}

	const ratio = count / max;

	if (ratio >= 0.75) {
		return 'bg-ink';
	}

	if (ratio >= 0.5) {
		return 'bg-primary-500';
	}

	if (ratio >= 0.25) {
		return 'bg-primary-300';
	}

	return 'bg-primary-200';
}

export function buildYearHeatmap(
	year: number,
	activeDays: HomeActivityDay[],
	monthLabel: (monthIndex: number) => string
): YearHeatmap {
	const counts = new Map<string, number>();

	for (const day of activeDays) {
		if (!day.date?.startsWith(`${year}-`)) {
			continue;
		}

		if (day.count > 0) {
			counts.set(day.date, (counts.get(day.date) ?? 0) + day.count);
		}
	}

	const totalDays = daysInYear(year);
	const leading = mondayIndex(utcDate(year, 0, 1));
	const weekCount = Math.ceil((leading + totalDays) / 7);
	const cells: YearHeatmapCell[] = Array.from({ length: weekCount * 7 }, () => ({
		date: null,
		count: 0
	}));
	const monthLabels: YearHeatmapMonthLabel[] = [];
	const monthWeekEndColumn: number[] = [];
	let labeledMonth = -1;

	for (let dayOfYear = 0; dayOfYear < totalDays; dayOfYear += 1) {
		const date = utcDate(year, 0, 1 + dayOfYear);
		const slot = leading + dayOfYear;
		const weekColumn = Math.floor(slot / 7);
		const dateKey = formatUtc(date);

		cells[slot] = {
			date: dateKey,
			count: counts.get(dateKey) ?? 0
		};

		const month = date.getUTCMonth();

		if (month !== labeledMonth) {
			monthLabels.push({
				column: weekColumn,
				label: monthLabel(month)
			});
			labeledMonth = month;
		}

		monthWeekEndColumn[month] = weekColumn;
	}

	const monthSpans: YearHeatmapMonthSpan[] = monthLabels.map((entry, index) => ({
		label: entry.label,
		monthIndex: index,
		weekStart: entry.column,
		weekEnd: monthWeekEndColumn[index] ?? entry.column
	}));

	return {
		year,
		weekCount,
		cells,
		monthLabels,
		monthSpans
	};
}
