import type {
	CompactConversationMessage,
	CompactConversationUserMessage,
	CompactConversationAiMessage
} from '../../../../../../contexts/messages-context.svelte';
import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';

export interface ConversationSummaryData {
	messages: CompactConversationMessage[];
	userMessages: CompactConversationUserMessage[];
	aiMessages: CompactConversationAiMessage[];
	messagesWithFeedback: CompactConversationUserMessage[];
	feedbacks: ConversationUserMessageFeedbackDTO[];
	totalMessages: number;
	totalLearningTips: number;
	totalMistakes: number;
	totalStrengths: number;
	totalSuggestions: number;
	averageGrammar: number | null;
	averageVocabulary: number | null;
	averageNaturalness: number | null;
}
