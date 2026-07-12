import type {
	ConversationMessageMistake,
	ConversationMessageStrength,
	ConversationMessageSuggestion
} from '$conversations/types';

interface AggregatedAnalysisItemBase {
	phrase: string;
	searchableText: string;
	explanation: string;
	createdAt: Date;
}

export interface AggregatedMistake extends AggregatedAnalysisItemBase {
	type: 'MISTAKES';
	data: ConversationMessageMistake;
}

export interface AggregatedStrength extends AggregatedAnalysisItemBase {
	type: 'STRENGTHS';
	data: ConversationMessageStrength;
}

export interface AggregatedSuggestion extends AggregatedAnalysisItemBase {
	type: 'SUGGESTIONS';
	data: ConversationMessageSuggestion;
}

export type AggregatedAnalysisItem = AggregatedMistake | AggregatedStrength | AggregatedSuggestion;
