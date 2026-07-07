import type { components } from '@kacper-ksiazek/ord-api-types';

export type ConversationUserMessageAnalysisDTO =
	components['schemas']['ConversationUserMessageAnalysisDTO'];

export type ConversationMessageMistake = components['schemas']['ConversationMessageMistake'];
export type ConversationMessageMistakeSeverity =
	components['schemas']['ConversationMessageMistakeSeverity'];

export type ConversationMessageSuggestion = components['schemas']['ConversationMessageSuggestion'];
export type ConversationMessageSuggestionType =
	components['schemas']['ConversationMessageSuggestionType'];

export type ConversationMessageStrength = components['schemas']['ConversationMessageStrength'];
export type ConversationMessageStrengthType =
	components['schemas']['ConversationMessageStrengthType'];

export type ConversationMessagePerformanceScore = keyof Pick<
	ConversationUserMessageAnalysisDTO,
	'grammar' | 'vocabulary' | 'naturalness'
>;

export const CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP: Record<
	ConversationMessageMistakeSeverity,
	number
> = {
	MINOR: 1,
	MODERATE: 2,
	CRITICAL: 3
};
