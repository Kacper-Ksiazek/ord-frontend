import type {
	ConversationMessageMistake,
	ConversationMessageStrength,
	ConversationMessageSuggestion
} from '$lib/types/conversation/domain/conversation-message-feedback';

interface AggregatedFeedbackItemBase {
	phrase: string;
	searchableText: string;
	explanation: string;
	createdAt: Date;
}

export interface AggregatedMistake extends AggregatedFeedbackItemBase {
	type: 'MISTAKES';
	data: ConversationMessageMistake;
}

export interface AggregatedStrength extends AggregatedFeedbackItemBase {
	type: 'STRENGTHS';
	data: ConversationMessageStrength;
}

export interface AggregatedSuggestion extends AggregatedFeedbackItemBase {
	type: 'SUGGESTIONS';
	data: ConversationMessageSuggestion;
}

export type AggregatedFeedbackItem = AggregatedMistake | AggregatedStrength | AggregatedSuggestion;
