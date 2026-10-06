import type { HomeActivityDay, HomeActivityPerDay, HomeResponse } from '$home/types';

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

function emptyTrends() {
	const series = buildZeroTrendSeries(90);

	return {
		wordsAdded: series,
		conversationsCreated: series,
		messages: series,
		gamesFinished: series
	};
}

/** DEV preview: zeroed home summary matching an empty account. */
export function buildEmptyHomeResponse(): HomeResponse {
	const trends = emptyTrends();

	return {
		overviews: {
			words: {
				total: 0,
				addedLast30Days: 0,
				byType: {},
				trend: trends.wordsAdded
			},
			conversations: {
				total: 0,
				messagesTotal: 0,
				createdLast30Days: 0,
				messagesLast30Days: 0,
				createdTrend: trends.conversationsCreated,
				messagesTrend: trends.messages
			},
			games: {
				comingSoon: true,
				total: null,
				last30Days: null,
				trend: trends.gamesFinished
			}
		},
		recentContent: {
			words: [],
			conversations: []
		}
	};
}

/** DEV preview: empty year heatmap matching an account with no activity. */
export function buildEmptyHomeActivity(reference = new Date()): HomeActivityPerDay {
	return {
		year: reference.getUTCFullYear(),
		days: []
	};
}
