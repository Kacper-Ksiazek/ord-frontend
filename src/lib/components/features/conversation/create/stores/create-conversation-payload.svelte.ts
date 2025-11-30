import { authStore } from '$lib/stores/auth.svelte';
import type { CreateConversationRequest } from '$lib/types/conversation/api/requests';
import type { ConversationAIInterlocutorAvatarId } from '$lib/types/conversation/domain/conversation';
import type { LanguageName } from '$lib/types/core/domain/languages';

type CreateConversationPayload = Partial<
	Omit<CreateConversationRequest, 'language' | 'aiInterlocutorAvatarId'>
> &
	Pick<CreateConversationRequest, 'language'> & {
		aiInterlocutorAvatarId?: ConversationAIInterlocutorAvatarId;
	};

const createConversationPayload = $state<CreateConversationPayload>({
	language: authStore.user?.selectedLearningLanguage as LanguageName,
	tone: 'ENCOURAGING',
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
