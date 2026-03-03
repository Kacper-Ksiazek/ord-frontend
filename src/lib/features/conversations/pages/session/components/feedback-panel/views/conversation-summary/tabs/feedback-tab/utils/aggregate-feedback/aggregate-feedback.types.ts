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

export function isFeedbackMistake(feedback: AggregatedFeedbackItem): feedback is AggregatedMistake {
	return feedback.type === 'MISTAKES';
}

export function isFeedbackStrength(
	feedback: AggregatedFeedbackItem
): feedback is AggregatedStrength {
	return feedback.type === 'STRENGTHS';
}

export function isFeedbackSuggestion(
	feedback: AggregatedFeedbackItem
): feedback is AggregatedSuggestion {
	return feedback.type === 'SUGGESTIONS';
}
