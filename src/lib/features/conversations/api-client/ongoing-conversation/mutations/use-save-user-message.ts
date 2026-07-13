import { createMutation } from '@tanstack/svelte-query';
import type { SaveUserConversationMessageRequest } from '$conversations/types';
import { httpSaveUserMessage } from '../api/http-save-user-message';

export function createSaveUserMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: SaveUserConversationMessageRequest) => httpSaveUserMessage(body)
	}));
}
