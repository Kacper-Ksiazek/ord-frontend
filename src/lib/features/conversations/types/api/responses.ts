import type { components } from '@kacper-ksiazek/ord-api-types';

export type ReviewedUserConversationMessage =
	components['schemas']['ConversationUserMessageAnalysisPayload'];
export type GeneratedAIInterlocutorData = components['schemas']['GeneratedAIInterlocutorData'];

export type SuggestedConversationTopic = string[];
