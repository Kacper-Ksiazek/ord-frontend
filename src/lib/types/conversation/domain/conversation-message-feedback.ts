import type { components } from '@ord-api/ord-api-types';

export type ConversationUserMessageFeedbackDTO =
	components['schemas']['ConversationUserMessageFeedbackDTO'];

export type ConversationMessageMistake = components['schemas']['Mistake'];
export type ConversationMessageVocabularyEnrichment = components['schemas']['VocabularyEnrichment'];
export type ConversationMessageAlternativeExpression =
	components['schemas']['AlternativeExpression'];

export type ConversationErrorMessageType = components['schemas']['ErrorType'];
