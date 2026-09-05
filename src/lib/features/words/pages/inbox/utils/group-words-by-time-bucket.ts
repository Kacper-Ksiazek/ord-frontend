export type TimeBucket = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'earlier';

export type TimeBucketGroup<T> = {
	bucket: TimeBucket;
	items: T[];
};

const BUCKET_ORDER: TimeBucket[] = ['today', 'yesterday', 'this_week', 'last_week', 'earlier'];

function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeekMonday(date: Date): Date {
	const dayStart = startOfDay(date);
	const day = dayStart.getDay();
	const daysFromMonday = (day + 6) % 7;
	dayStart.setDate(dayStart.getDate() - daysFromMonday);

	return dayStart;
}

export function getTimeBucket(createdAt: Date, now: Date = new Date()): TimeBucket {
	const today = startOfDay(now);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const itemDay = startOfDay(createdAt);

	if (itemDay.getTime() === today.getTime()) {
		return 'today';
	}

	if (itemDay.getTime() === yesterday.getTime()) {
		return 'yesterday';
	}

	const thisWeekStart = startOfWeekMonday(now);
	if (createdAt >= thisWeekStart) {
		return 'this_week';
	}

	const lastWeekStart = new Date(thisWeekStart);
	lastWeekStart.setDate(lastWeekStart.getDate() - 7);
	if (createdAt >= lastWeekStart) {
		return 'last_week';
	}

	return 'earlier';
}

export function groupWordsByTimeBucket<T extends { createdAt?: string | null }>(
	items: T[],
	now: Date = new Date()
): TimeBucketGroup<T>[] {
	const groups = new Map<TimeBucket, T[]>();

	for (const item of items) {
		const bucket = item.createdAt ? getTimeBucket(new Date(item.createdAt), now) : 'earlier';
		const list = groups.get(bucket) ?? [];
		list.push(item);
		groups.set(bucket, list);
	}

	return BUCKET_ORDER.filter((bucket) => groups.has(bucket)).map((bucket) => ({
		bucket,
		items: groups.get(bucket) ?? []
	}));
}
