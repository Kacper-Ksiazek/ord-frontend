import type {
	ConversationDTO,
	ConversationType,
	ConversationAITone,
	ConversationAIInterlocutorAvatarId
} from '$conversations/types/domain/conversation';
import { createContext } from 'svelte';

export interface CompactConversationData {
	id: string;
	topic: string;
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
		id: conversation.id,
		topic: conversation.topic,
		type: conversation.type,
		aiTone: conversation.aiTone,
		proficiencyLevel: conversation.proficiencyLevel,
		interlocutor: {
			name: conversation.aiInterlocutorName ?? '',
			avatarId: conversation.aiInterlocutorAvatarId as ConversationAIInterlocutorAvatarId
		},
		createdAt: conversation.createdAt
	});
}
