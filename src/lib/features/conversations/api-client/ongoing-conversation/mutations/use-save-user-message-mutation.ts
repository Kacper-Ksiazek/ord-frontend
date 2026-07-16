import { createMutation } from '@tanstack/svelte-query';
import type { SaveUserConversationMessageRequest } from '$conversations/types';
import { httpPostSaveUserMessage } from '../api/http-post-save-user-message';

export function createSaveUserMessageMutation() {
	return createMutation(() => ({
		mutationFn: (body: SaveUserConversationMessageRequest) => httpPostSaveUserMessage(body)
	}));
}
