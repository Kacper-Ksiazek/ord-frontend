import type { components } from '@ord-api/ord-api-types';

export type ConversationType = components['schemas']['ConversationDTO']['type'];
export type ConversationAITone = components['schemas']['ConversationDTO']['aiTone'];
export type ConversationMessageSender = components['schemas']['ConversationMessageDTO']['sender'];
export type ConversationAIInterlocutorAvatarId =
	components['schemas']['GeneratedAIInterlocutorData']['avatarId'];

export type ConversationDTO = components['schemas']['ConversationDTO'];
