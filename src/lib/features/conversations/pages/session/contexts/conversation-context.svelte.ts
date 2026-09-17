import type {
	ConversationDTO,
	ConversationType,
	ConversationAITone,
	ConversationAIInterlocutorAvatarId
} from '$conversations/types';
import type { LanguageName } from '$lib/types/core/domain/languages';
import { createContext } from 'svelte';

export interface CompactConversationData {
	id: string;
	topic: string;
	language: LanguageName;
	type: ConversationType;
	aiTone: ConversationAITone;
	proficiencyLevel: ConversationDTO['proficiencyLevel'];
	interlocutor: {
		name: string;
		avatarId: ConversationAIInterlocutorAvatarId;
	};
	createdAt: string;
}

const [getConversationContext, setConversationContext] = createContext<CompactConversationData>();

export { getConversationContext, setConversationContext };

export function createConversationContext(conversation: ConversationDTO) {
	setConversationContext({
		id: conversation.id ?? '',
		topic: conversation.topic ?? '',
		language: conversation.language ?? 'ENGLISH',
		type: conversation.type ?? 'SMALL_TALK',
		aiTone: conversation.aiTone ?? 'NEUTRAL',
		proficiencyLevel: conversation.proficiencyLevel,
		interlocutor: {
			name: conversation.aiInterlocutorName ?? '',
			avatarId: (conversation.aiInterlocutorAvatarId ??
				'AVATAR_DEFAULT') as ConversationAIInterlocutorAvatarId
		},
		createdAt: conversation.createdAt ?? ''
	});
}
