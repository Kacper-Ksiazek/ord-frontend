import type { CreateConversationRequest } from '$conversations/types';
import type { ConversationDTO } from '$conversations/types';
import type { LanguageName } from '$lib/types/core/domain/languages';

export type { ConversationDTO, CreateConversationRequest };

export type SeedConversationOptions = Partial<
	Pick<
		CreateConversationRequest,
		'type' | 'topic' | 'tone' | 'aiInterlocutorName' | 'aiInterlocutorAvatarId'
	>
> & {
	language?: CreateConversationRequest['language'];
};

export type LanguageProficienciesIndex = Partial<Record<LanguageName, string>>;
