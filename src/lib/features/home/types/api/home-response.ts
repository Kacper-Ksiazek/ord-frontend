import type { ConversationSummaryDTO } from '$conversations/types';
import type { WordListItem, WordType } from '$words/types';

/**
 * Mirrors GET /api/v1/home (`HomeResponse`) until `@kacper-ksiazek/ord-api-types` includes this schema.
 */
export type HomeActivityDay = {
	date: string;
	count: number;
};

export type HomeTrendsSection = {
	wordsAdded: HomeActivityDay[];
	conversationsCreated: HomeActivityDay[];
	messages: HomeActivityDay[];
	gamesFinished: HomeActivityDay[];
};

export type HomeResponse = {
	words: {
		total: number;
		addedLast30Days: number;
		byType: Partial<Record<WordType, number>>;
	};
	conversations: {
		total: number;
		messagesTotal: number;
		createdLast30Days: number;
		messagesLast30Days: number;
	};
	games: {
		comingSoon: boolean;
		total: number | null;
		last30Days: number | null;
	};
	trends: HomeTrendsSection;
	activity: {
		year: number;
		days: HomeActivityDay[];
	};
	recentWords: WordListItem[];
	recentConversations: ConversationSummaryDTO[];
};
