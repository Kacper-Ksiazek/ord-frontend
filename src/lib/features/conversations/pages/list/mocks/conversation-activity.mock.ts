import type { ConversationListActivitySnapshot } from '$lib/types/conversation/api/conversation-list-activity';
import type { LineChartDataPoint } from '$lib/components/cards/line-chart-card';

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

/**
 * Builds the last 90 calendar days ending on `anchor` (local timezone), with deterministic per-day counts.
 */
export function buildMockConversationActivity(anchor: Date): ConversationListActivitySnapshot {
	const daily: ConversationListActivitySnapshot['daily'] = [];

	for (let offset = 89; offset >= 0; offset--) {
		const d = new Date(anchor);
		d.setHours(12, 0, 0, 0);
		d.setDate(d.getDate() - offset);
		const date = formatLocalYmd(d);
		const h = hashDay(date);
		const messageCount = h % 4 === 0 ? 0 : (h % 11) + 1;
		daily.push({ date, messageCount });
	}

	const messagesLast90Days = daily.reduce((acc, p) => acc + p.messageCount, 0);
	const anchorStr = formatLocalYmd(anchor);
	const conversationsStartedLast90Days = 18 + (hashDay(`${anchorStr}:conv`) % 31);

	return {
		daily,
		stats: {
			messagesCount: messagesLast90Days,
			conversationsCount: conversationsStartedLast90Days,
			period: 'Last 90 days'
		}
	};
}

/** Last `points` days of daily message counts for mini line charts (labels not shown on chart). */
export function buildMessagesTrendSeries(
	daily: ConversationListActivitySnapshot['daily'],
	points = 14
): LineChartDataPoint[] {
	if (daily.length === 0) return [];
	const slice = daily.slice(-points);

	return slice.map((d) => ({
		label: d.date,
		value: d.messageCount
	}));
}

/**
 * Deterministic mock conversations-per-day trend (no real per-day API yet).
 * Mirrors the date range of `buildMessagesTrendSeries` for coherent demos.
 */
export function buildConversationsTrendMock(
	daily: ConversationListActivitySnapshot['daily'],
	points = 14
): LineChartDataPoint[] {
	if (daily.length === 0) return [];
	const slice = daily.slice(-points);

	return slice.map((d) => {
		const h = hashDay(`${d.date}:conv`);

		return {
			label: d.date,
			value: 1 + (h % 12)
		};
	});
}
