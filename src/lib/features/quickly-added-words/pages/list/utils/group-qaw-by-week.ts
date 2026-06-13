import type { QuicklyAddedWordDTO } from '$lib/types/quickly-added-word';

export type QawWeekSectionGroup = {
	sectionKey: string;
	label: string;
	items: QuicklyAddedWordDTO[];
};

export type QawWeekSectionLabels = {
	thisWeek: string;
	lastWeek: string;
};

/** Monday 00:00 local time of the ISO week containing `date`. */
export function startOfIsoWeekMonday(date: Date): Date {
	const copy = new Date(date);
	copy.setHours(0, 0, 0, 0);
	const jsDayOfWeek = copy.getDay();
	const offset = jsDayOfWeek === 0 ? -6 : 1 - jsDayOfWeek;
	copy.setDate(copy.getDate() + offset);

	return copy;
}

function addDays(date: Date, delta: number): Date {
	const next = new Date(date);
	next.setDate(next.getDate() + delta);

	return next;
}

function formatLocalYmd(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

function formatWeekRangeLabel(weekStart: Date, weekEnd: Date, locale?: string | string[]): string {
	const start = weekStart.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
	const end = weekEnd.toLocaleDateString(locale, {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});

	return `${start} – ${end}`;
}

export function formatQawWeekSectionLabel(
	weekStart: Date,
	now: Date = new Date(),
	locale?: string | string[],
	labels: QawWeekSectionLabels = { thisWeek: 'This week', lastWeek: 'Last week' }
): string {
	const thisWeekStart = startOfIsoWeekMonday(now);
	const lastWeekStart = addDays(thisWeekStart, -7);

	if (weekStart.getTime() === thisWeekStart.getTime()) {
		return labels.thisWeek;
	}

	if (weekStart.getTime() === lastWeekStart.getTime()) {
		return labels.lastWeek;
	}

	return formatWeekRangeLabel(weekStart, addDays(weekStart, 6), locale);
}

export function groupQawByWeek(
	items: readonly QuicklyAddedWordDTO[],
	options?: {
		now?: Date;
		locale?: string | string[];
		labels?: QawWeekSectionLabels;
	}
): QawWeekSectionGroup[] {
	const now = options?.now ?? new Date();
	const locale = options?.locale;
	const labels = options?.labels ?? { thisWeek: 'This week', lastWeek: 'Last week' };
	const buckets = new Map<string, { weekStart: Date; items: QuicklyAddedWordDTO[] }>();

	for (const item of items) {
		const createdAt = new Date(item.createdAt);

		if (Number.isNaN(createdAt.getTime())) {
			continue;
		}

		const weekStart = startOfIsoWeekMonday(createdAt);
		const sectionKey = formatLocalYmd(weekStart);

		let bucket = buckets.get(sectionKey);
		if (!bucket) {
			bucket = { weekStart, items: [] };
			buckets.set(sectionKey, bucket);
		}

		bucket.items.push(item);
	}

	return [...buckets.entries()]
		.sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
		.map(([sectionKey, { weekStart, items: sectionItems }]) => ({
			sectionKey,
			label: formatQawWeekSectionLabel(weekStart, now, locale, labels),
			items: sectionItems
		}));
}
