import { createMutation } from '@tanstack/svelte-query';
import type { GenerateAiInterlocutorRequest } from '$conversations/types';
import { httpPostGenerateAIInterlocutor } from '../api/http-post-generate-ai-interlocutor';

export function createGenerateAiInterlocutorMutation() {
	return createMutation(() => ({
		mutationFn: (body: GenerateAiInterlocutorRequest) => httpPostGenerateAIInterlocutor(body)
	}));
}
