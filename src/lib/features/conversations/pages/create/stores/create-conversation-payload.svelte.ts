import { authStore } from '$auth/stores';
import type { CreateConversationRequest } from '$conversations/types';
import type { ConversationAIInterlocutorAvatarId } from '$conversations/types';

type CreateConversationPayload = Partial<
	Omit<CreateConversationRequest, 'language' | 'aiInterlocutorAvatarId'>
> &
	Pick<CreateConversationRequest, 'language'> & {
		aiInterlocutorAvatarId?: ConversationAIInterlocutorAvatarId;
	};

const createConversationPayload = $state<CreateConversationPayload>({
	language: authStore.user?.selectedLearningLanguage ?? 'ENGLISH',
	tone: undefined,
	topic: undefined,
	additionalContext: undefined,
	aiInterlocutorName: undefined,
	aiInterlocutorAvatarId: undefined,
	type: undefined
});

export function getCreateConversationPayload() {
	return createConversationPayload;
}

export function setCreateConversationPayload(payload: Partial<CreateConversationPayload>) {
	Object.assign(createConversationPayload, payload);
}
