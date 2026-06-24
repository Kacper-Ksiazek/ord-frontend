import type { components } from '@kacper-ksiazek/ord-api-types';

export type CreateConversationRequest = components['schemas']['CreateConversationRequest'];

export type SuggestTopicsRequest = components['schemas']['SuggestConversationTopicRequest'];

export type GenerateAiInterlocutorRequest =
	components['schemas']['GenerateAIInterlocutorDataRequest'];

export type RecentInterlocutorInfo = components['schemas']['RecentInterlocutorInfo'];
