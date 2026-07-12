import { createMutation } from '@tanstack/svelte-query';
import type { GenerateAiInterlocutorRequest } from '$conversations/types';
import { generateAiInterlocutor } from '../api/generate-ai-interlocutor';

export function createGenerateAiInterlocutorMutation() {
	return createMutation(() => ({
		mutationFn: (body: GenerateAiInterlocutorRequest) => generateAiInterlocutor(body)
	}));
}
