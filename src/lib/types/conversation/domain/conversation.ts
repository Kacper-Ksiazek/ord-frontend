import type { components } from '@kacper-ksiazek/ord-api-types';

export type ConversationType = components['schemas']['ConversationDTO']['type'];
export type ConversationAITone = components['schemas']['ConversationDTO']['aiTone'];
export type ConversationMessageSender = components['schemas']['ConversationMessageDTO']['sender'];
export type ConversationAIInterlocutorAvatarId =
	components['schemas']['GeneratedAIInterlocutorData']['avatarId'];

export type ConversationDTO = components['schemas']['ConversationDTO'];
export type ConversationSummaryDTO = components['schemas']['ConversationSummaryDTO'];
export type RecencyBucket = components['schemas']['RecencyBucket'];
