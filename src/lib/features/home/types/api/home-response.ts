import type { ConversationAITone, ConversationType } from '$conversations/types';
import type { WordExtraMark, WordType } from '$words/types';

/**
 * Mirrors GET /api/v1/home (`HomeResponse`) until `@kacper-ksiazek/ord-api-types` includes this schema.
 */
export type HomeActivityDay = {
	date: string;
	count: number;
};

export type HomeWordsOverview = {
	total: number;
	addedLast30Days: number;
	byType: Partial<Record<WordType, number>>;
	trend: HomeActivityDay[];
};

export type HomeConversationsOverview = {
	total: number;
	messagesTotal: number;
	createdLast30Days: number;
	messagesLast30Days: number;
	createdTrend: HomeActivityDay[];
	messagesTrend: HomeActivityDay[];
};

export type HomeGamesOverview = {
	comingSoon: boolean;
	total: number | null;
	last30Days: number | null;
	trend: HomeActivityDay[];
};

export type HomeRecentWord = {
	id: string;
	sourceWord: string;
	translation: string;
	definitionPreview?: string | null;
	isBookmarked: boolean;
	type: WordType;
	extraMark?: WordExtraMark | null;
};

export type HomeRecentConversation = {
	id: string;
	topic: string;
	type: ConversationType;
	aiTone: ConversationAITone;
	aiInterlocutorName: string;
	aiInterlocutorAvatarId: string;
	updatedAt: string;
};

export type HomeResponse = {
	overviews: {
		words: HomeWordsOverview;
		conversations: HomeConversationsOverview;
		games: HomeGamesOverview;
	};
	activityPerDay: {
		year: number;
		days: HomeActivityDay[];
	};
	recentContent: {
		words: HomeRecentWord[];
		conversations: HomeRecentConversation[];
	};
};
