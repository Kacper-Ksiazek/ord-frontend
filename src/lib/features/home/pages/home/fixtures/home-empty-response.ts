import type { HomeActivityDay, HomeResponse, HomeTrendsSection } from '$home/types';

function formatUtcDateKey(date: Date): string {
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');

	return `${date.getUTCFullYear()}-${month}-${day}`;
}

function buildZeroTrendSeries(dayCount: number): HomeActivityDay[] {
	const days: HomeActivityDay[] = [];
	const end = new Date();

	for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
		const date = new Date(
			Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() - offset)
		);

		days.push({
			date: formatUtcDateKey(date),
			count: 0
		});
	}

	return days;
}

function emptyTrends(): HomeTrendsSection {
	const series = buildZeroTrendSeries(90);

	return {
		wordsAdded: series,
		conversationsCreated: series,
		messages: series,
		gamesFinished: series
	};
}

/** DEV preview: zeroed home summary matching an empty account. */
export function buildEmptyHomeResponse(reference = new Date()): HomeResponse {
	return {
		words: {
			total: 0,
			addedLast30Days: 0,
			byType: {}
		},
		conversations: {
			total: 0,
			messagesTotal: 0,
			createdLast30Days: 0,
			messagesLast30Days: 0
		},
		games: {
			comingSoon: true,
			total: null,
			last30Days: null
		},
		trends: emptyTrends(),
		activity: {
			year: reference.getUTCFullYear(),
			days: []
		},
		recentWords: [],
		recentConversations: []
	};
}
