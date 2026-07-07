import type { components } from '@kacper-ksiazek/ord-api-types';

export type CreateOngoingConversationMessageRequest =
	components['schemas']['CreateAIConversationMessageRequest'];

export type SaveUserConversationMessageRequest =
	components['schemas']['SaveUserConversationMessageRequest'];

export type GetAnalysisForUserConversationMessageRequest =
	components['schemas']['GetAnalysisForUserConversationMessageRequest'];

export type GetLearningTipsForAIMessageRequest =
	components['schemas']['GetLearningTipsForAIMessageRequest'];
