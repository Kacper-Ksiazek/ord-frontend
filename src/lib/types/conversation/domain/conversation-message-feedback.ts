import type { components } from '@ord-api/ord-api-types';

export type ConversationUserMessageFeedbackDTO =
	components['schemas']['ConversationUserMessageFeedbackDTO'];

export type ConversationMessageMistake = components['schemas']['ConversationMessageMistake'];
export type ConversationMessageMistakeSeverity =
	components['schemas']['ConversationMessageMistakeSeverity'];

export type ConversationMessageSuggestion = components['schemas']['ConversationMessageSuggestion'];
export type ConversationMessageSuggestionType =
	components['schemas']['ConversationMessageSuggestionType'];

export type ConversationMessageStrength = components['schemas']['ConversationMessageStrength'];
export type ConversationMessageStrengthType =
	components['schemas']['ConversationMessageStrengthType'];

export const CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP: Record<
	ConversationMessageMistakeSeverity,
	number
> = {
	MINOR: 1,
	MODERATE: 2,
	CRITICAL: 3
};
