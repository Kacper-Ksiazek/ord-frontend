import { authStore } from '$lib/stores/auth.svelte';
import type { CreateConversationRequest } from '$lib/types/conversation/api/requests';
import type { LanguageName } from '$lib/types/core/domain/languages';

type CreateConversationPayload = Partial<Omit<CreateConversationRequest, 'language'>> &
	Pick<CreateConversationRequest, 'language'>;

const createConversationPayload = $state<CreateConversationPayload>({
	language: authStore.user?.selectedLearningLanguage as LanguageName,
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
