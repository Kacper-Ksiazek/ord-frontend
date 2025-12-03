import { createMutation } from '@tanstack/svelte-query';
import type { SaveUserConversationMessageRequest } from '$lib/types/ongoing-conversation/api/requests';
import { saveUserMessage } from '../api/save-user-message';

export function createSaveUserMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: SaveUserConversationMessageRequest) => saveUserMessage(body)
	}));
}
