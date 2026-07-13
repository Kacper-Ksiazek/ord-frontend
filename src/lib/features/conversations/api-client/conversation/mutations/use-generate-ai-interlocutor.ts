import { createMutation } from '@tanstack/svelte-query';
import type { GenerateAiInterlocutorRequest } from '$conversations/types';
import { httpGenerateAiInterlocutor } from '../api/http-generate-ai-interlocutor';

export function createGenerateAiInterlocutorMutation() {
	return createMutation(() => ({
		mutationFn: (body: GenerateAiInterlocutorRequest) => httpGenerateAiInterlocutor(body)
	}));
}
