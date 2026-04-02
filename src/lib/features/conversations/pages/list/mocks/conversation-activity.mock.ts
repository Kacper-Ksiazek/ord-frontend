import {
	HeatmapPercentile,
	type ActivityWeekPoint,
	type ConversationActivityOverview,
	type HeatmapDay
} from '$lib/types/conversation/api/conversation-list-activity';

function formatLocalYmd(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	return `${y}-${m}-${day}`;
}

/** Simple deterministic pseudo-random in [0, n) from a date string. */
function hashDay(date: string): number {
	let h = 0;
	for (let i = 0; i < date.length; i++) {
		h = (Math.imul(31, h) + date.charCodeAt(i)) | 0;
	}

	return Math.abs(h);
}

function countToPercentile(count: number): HeatmapPercentile {
	if (count <= 0) return HeatmapPercentile.P0;
	if (count < 3) return HeatmapPercentile.P20;
	if (count < 6) return HeatmapPercentile.P40;
	if (count < 9) return HeatmapPercentile.P60;

	return HeatmapPercentile.P80;
}

/** Monday 00:00 local time of the ISO week containing `d`. */
function startOfIsoWeekMonday(d: Date): Date {
	const copy = new Date(d);
	copy.setHours(0, 0, 0, 0);
	const jsDow = copy.getDay();
	const offset = jsDow === 0 ? -6 : 1 - jsDow;
	copy.setDate(copy.getDate() + offset);

	return copy;
}

function addDays(d: Date, delta: number): Date {
	const next = new Date(d);
	next.setDate(next.getDate() + delta);

	return next;
}

function weekRangeLabel(weekStart: Date, weekEnd: Date): string {
	const start = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	const end = weekEnd.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});

	return `${start} – ${end}`;
}

function buildWeekAggregates(
	days: HeatmapDay[],
	anchor: Date,
	numWeeks: number,
	countForDay: (date: string, messageCount: number) => number
): ActivityWeekPoint[] {
	const byDate = new Map(days.map((d) => [d.date, d.count]));
	const anchorWeekStart = startOfIsoWeekMonday(anchor);
	const points: ActivityWeekPoint[] = [];

	for (let w = numWeeks - 1; w >= 0; w -= 1) {
		const weekStart = addDays(anchorWeekStart, -w * 7);
		const weekEnd = addDays(weekStart, 6);
		let sum = 0;

		for (let i = 0; i < 7; i += 1) {
			const day = addDays(weekStart, i);
			const ymd = formatLocalYmd(day);
			const messages = byDate.get(ymd) ?? 0;
			sum += countForDay(ymd, messages);
		}

		points.push({
			weekRange: weekRangeLabel(weekStart, weekEnd),
			count: sum
		});
	}

	return points;
}

/**
 * Builds the last 90 calendar days ending on `anchor` (local timezone), with deterministic per-day counts,
 * plus weekly series aligned to the last 14 ISO weeks ending on the anchor week.
 */
export function buildMockConversationActivity(anchor: Date): ConversationActivityOverview {
	const heatmap: HeatmapDay[] = [];

	for (let offset = 89; offset >= 0; offset--) {
		const d = new Date(anchor);
		d.setHours(12, 0, 0, 0);
		d.setDate(d.getDate() - offset);
		const date = formatLocalYmd(d);
		const h = hashDay(date);
		const count = h % 4 === 0 ? 0 : (h % 11) + 1;
		heatmap.push({
			date,
			count,
			percentile: countToPercentile(count)
		});
	}

	const messagesTotal = heatmap.reduce((acc, p) => acc + p.count, 0);
	const anchorStr = formatLocalYmd(anchor);
	const conversationsTotal = 18 + (hashDay(`${anchorStr}:conv`) % 31);

	const messagesByWeek = buildWeekAggregates(
		heatmap,
		anchor,
		14,
		(_date, messageCount) => messageCount
	);
	const conversationsByWeek = buildWeekAggregates(heatmap, anchor, 14, (date, messageCount) => {
		const h = hashDay(`${date}:conv`);

		return Math.max(0, Math.round((messageCount + (h % 5)) / 3));
	});

	return {
		periodLabel: 'Last 90 days',
		messagesTotal,
		conversationsTotal,
		heatmap,
		messagesByWeek,
		conversationsByWeek
	};
}
