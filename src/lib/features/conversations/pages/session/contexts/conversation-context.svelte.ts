import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
import { createContext } from 'svelte';

export interface CompactConversationData {
	id: string;
	topic: string;
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
		interlocutor: {
			name: conversation.aiInterlocutorName ?? '',
			avatarId: conversation.aiInterlocutorAvatarId ?? ''
		}
	});
}
