import type {
	ConversationDTO,
	ConversationType,
	ConversationAITone
} from '$lib/types/conversation/domain/conversation';
import { createContext } from 'svelte';

export interface CompactConversationData {
	id: string;
	topic: string;
	type: ConversationType;
	aiTone: ConversationAITone;
	interlocutor: {
		name: string;
		avatarId: string;
	};
}

export const [getConversationContext, setConversationContext] =
	createContext<CompactConversationData>();

export function createConversationContext(conversation: ConversationDTO) {
	setConversationContext({
		id: conversation.id,
		topic: conversation.topic,
		type: conversation.type,
		aiTone: conversation.aiTone,
		interlocutor: {
			name: conversation.aiInterlocutorName ?? '',
			avatarId: conversation.aiInterlocutorAvatarId ?? ''
		}
	});
}
