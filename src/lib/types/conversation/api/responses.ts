import type { components } from '@ord-api/ord-api-types';

export type ReviewedUserConversationMessage =
	components['schemas']['ConversationUserMessageAnalysisPayload'];
export type GeneratedAIInterlocutorData = components['schemas']['GeneratedAIInterlocutorData'];

export type SuggestedConversationTopic = string[];
