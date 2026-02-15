import type {
	CompactConversationMessage,
	CompactConversationUserMessage,
	CompactConversationAiMessage
} from '$lib/types/conversation/domain/conversation-message';
import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';

export interface ConversationSummaryData {
	messages: CompactConversationMessage[];
	userMessages: CompactConversationUserMessage[];
	aiMessages: CompactConversationAiMessage[];
	feedbacks: ConversationUserMessageFeedbackDTO[];
	totalMessages: number;
	totalLearningTips: number;
	totalMistakes: number;
	totalStrengths: number;
	totalSuggestions: number;
	mistakesBySeverity: {
		severity1: number; // MINOR
		severity2: number; // MODERATE
		severity3: number; // CRITICAL
	};
	learningTipsByCategory: {
		grammar: number;
		vocabulary: number;
		phrases: number;
	};
	averageGrammar: number | null;
	averageVocabulary: number | null;
	averageNaturalness: number | null;
	averageUserMessageCharacters: number | null;
	averageAiMessageCharacters: number | null;
}
